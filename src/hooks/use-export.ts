export function useExport() {
  function exportSVG(svgElement: SVGSVGElement | null, filename = 'phylogenetic-tree.svg') {
    if (!svgElement) return
    const clone = svgElement.cloneNode(true) as SVGSVGElement

    // Reset zoom/pan to show full tree
    const mainGroup = clone.querySelector('g')
    if (mainGroup) {
      mainGroup.removeAttribute('transform')
    }

    // Get the full bounding box of all content
    const bbox = getFullBBox(clone)

    // Set proper viewBox to include all content with padding
    const padding = 40
    clone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`)
    clone.setAttribute('width', String(bbox.width + padding * 2))
    clone.setAttribute('height', String(bbox.height + padding * 2))

    // Add white background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('x', String(bbox.x - padding))
    bg.setAttribute('y', String(bbox.y - padding))
    bg.setAttribute('width', String(bbox.width + padding * 2))
    bg.setAttribute('height', String(bbox.height + padding * 2))
    bg.setAttribute('fill', 'white')
    clone.insertBefore(bg, clone.firstChild)

    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try { return Array.from(sheet.cssRules || []).map(r => r.cssText).join('') } catch { return '' }
      })
      .join('')
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
    styleEl.textContent = styles
    clone.prepend(styleEl)

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(clone)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function exportPNG(svgElement: SVGSVGElement | null, filename = 'phylogenetic-tree.png') {
    if (!svgElement) return

    // Create a clean copy for export
    const clone = svgElement.cloneNode(true) as SVGSVGElement

    // Reset zoom/pan
    const mainGroup = clone.querySelector('g')
    if (mainGroup) {
      mainGroup.removeAttribute('transform')
    }

    const bbox = getFullBBox(clone)
    const padding = 40
    const width = bbox.width + padding * 2
    const height = bbox.height + padding * 2

    clone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`)
    clone.setAttribute('width', String(width))
    clone.setAttribute('height', String(height))

    // Add white background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('x', String(bbox.x - padding))
    bg.setAttribute('y', String(bbox.y - padding))
    bg.setAttribute('width', String(width))
    bg.setAttribute('height', String(height))
    bg.setAttribute('fill', 'white')
    clone.insertBefore(bg, clone.firstChild)

    const svgData = new XMLSerializer().serializeToString(clone)
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx!.scale(scale, scale)
      ctx!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = filename; a.click()
          URL.revokeObjectURL(url)
        }
      })
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return { exportSVG, exportPNG }
}

function getFullBBox(svg: SVGSVGElement): { x: number; y: number; width: number; height: number } {
  // Try to get bbox from all content elements
  try {
    const tempSvg = svg.cloneNode(true) as SVGSVGElement
      const g = tempSvg.querySelector('g')
      if (g) {
        g.removeAttribute('transform')

      // Create temporary container to measure
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.visibility = 'hidden'
      container.style.width = '9999px'
      container.style.height = '9999px'
      document.body.appendChild(container)
      container.appendChild(tempSvg)

      const bbox = g.getBBox()

      document.body.removeChild(container)

      if (bbox.width > 0 && bbox.height > 0) {
        return bbox
      }
    }
  } catch { /* fallback */ }

  // Fallback: use viewBox dimensions
  const vb = svg.getAttribute('viewBox')
  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number)
    return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] }
  }

  return { x: 0, y: 0, width: 800, height: 600 }
}
