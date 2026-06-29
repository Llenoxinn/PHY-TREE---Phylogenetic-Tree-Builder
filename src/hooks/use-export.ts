export function useExport() {
  function exportSVG(svgElement: SVGSVGElement | null, filename = 'phylogenetic-tree.svg') {
    if (!svgElement) return
    const clone = svgElement.cloneNode(true) as SVGSVGElement
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
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx!.scale(2, 2)
      ctx!.fillStyle = 'white'
      ctx!.fillRect(0, 0, canvas.width, canvas.height)
      ctx!.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = filename; a.click()
          URL.revokeObjectURL(url)
        }
      })
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return { exportSVG, exportPNG }
}
