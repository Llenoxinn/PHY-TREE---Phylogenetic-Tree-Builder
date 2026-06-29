import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { useTreeStore } from '../../store/tree-store'
import { useSequenceStore } from '../../store/sequence-store'
import { useUIStore } from '../../store/ui-store'
import { getLeafColor, type PaletteName } from '../../lib/utils/colors'
import type { TreeNode } from '../../types'

export function TreeCanvas() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { steps, currentStep, layoutType, selectNode } = useTreeStore()
  const { setHovered, hoveredIndex } = useSequenceStore()
  const { palette, theme, treeSettings } = useUIStore()

  const treeData = steps[currentStep]?.treeState ?? null

  const draw = useCallback(() => {
    const svgEl = svgRef.current
    const container = containerRef.current
    if (!svgEl || !container || !treeData) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 400
    const isCircular = layoutType === 'circular'
    const isDark = theme === 'dark'

    const textColor = isDark ? '#e0def4' : '#1a1a2e'
    const textColorMuted = isDark ? '#565f89' : '#868e96'
    const linkColor = treeSettings.branchColor || (isDark ? '#3b3f5c' : '#c5c9d6')
    const linkColorHover = isDark ? '#f43f5e' : '#e11d48'
    const nodeStroke = isDark ? '#1a1b26' : '#ffffff'
    const paletteName = palette as PaletteName

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)
    svg.style('font-family', 'var(--font-sans)')

    const defs = svg.append('defs')
    const filter = defs.append('filter').attr('id', 'glow')
    filter.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'coloredBlur')
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    const root = d3.hierarchy(treeData)

    if (isCircular) {
      drawCircular(svg, root, width, height, {
        textColor, textColorMuted, linkColor, linkColorHover, nodeStroke, paletteName,
        selectNode, setHovered, hoveredIndex, treeSettings,
      })
    } else {
      drawRectangular(svg, root, width, height, {
        textColor, textColorMuted, linkColor, linkColorHover, nodeStroke, paletteName,
        selectNode, setHovered, hoveredIndex, treeSettings,
      })
    }

  }, [treeData, layoutType, selectNode, setHovered, palette, theme, hoveredIndex, treeSettings])

  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    const observer = new ResizeObserver(() => draw())
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [draw])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

interface DrawOpts {
  textColor: string
  textColorMuted: string
  linkColor: string
  linkColorHover: string
  nodeStroke: string
  paletteName: PaletteName
  selectNode: (node: any) => void
  setHovered: (idx: number | null) => void
  hoveredIndex: number | null
  treeSettings: {
    branchStyle: string
    branchWidth: number
    nodeSize: number
    labelSize: number
    showLabels: boolean
    showDistances: boolean
    showScaleBar: boolean
    showGuideCircle: boolean
    leafShape: string
  }
}

function getBranchPath(sx: number, sy: number, tx: number, ty: number, style: string): string {
  switch (style) {
    case 'elbow':
      return `M${sx},${sy}H${tx}V${ty}`
    case 'diagonal':
      return `M${sx},${sy}L${tx},${ty}`
    case 'curved':
    default: {
      const mx = (sx + tx) / 2
      return `M${sx},${sy}C${mx},${sy} ${mx},${ty} ${tx},${ty}`
    }
  }
}

function drawRectangular(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  root: d3.HierarchyNode<TreeNode>,
  width: number,
  height: number,
  opts: DrawOpts,
) {
  const { textColor, textColorMuted, linkColor, linkColorHover, nodeStroke, paletteName, selectNode, setHovered, hoveredIndex, treeSettings } = opts

  const pad = { top: 24, right: 130, bottom: 30, left: 40 }
  const w = width - pad.left - pad.right
  const h = height - pad.top - pad.bottom

  const cluster = d3.cluster<TreeNode>().size([h, w])
  cluster(root)

  const g = svg.append('g').attr('transform', `translate(${pad.left},${pad.top})`)

  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.2, 8])
    .on('zoom', (event) => {
      g.attr('transform', `translate(${pad.left},${pad.top}) ${event.transform}`)
    })
  svg.call(zoom)

  const allLeaves = root.leaves()
  const leafIndexMap = new Map<string, number>()
  allLeaves.forEach((leaf, i) => leafIndexMap.set(leaf.data.id, i))

  // Links
  g.selectAll('.link')
    .data(root.links())
    .join('path')
    .attr('class', 'link')
    .attr('d', (d: any) => {
      const sx = d.source.y as number
      const sy = d.source.x as number
      const tx = d.target.y as number
      const ty = d.target.x as number
      return getBranchPath(sx, sy, tx, ty, treeSettings.branchStyle)
    })
    .attr('fill', 'none')
    .attr('stroke', linkColor)
    .attr('stroke-width', treeSettings.branchWidth)
    .attr('stroke-linecap', 'round')

  // Nodes
  const node = g.selectAll('.node')
    .data(root.descendants())
    .join('g')
    .attr('class', 'node')
    .attr('transform', (d: any) => `translate(${d.y},${d.x})`)

  // Leaf nodes
  const leafNodes = node.filter((d: any) => !d.children)
  const leafSize = treeSettings.nodeSize

  if (treeSettings.leafShape === 'circle') {
    leafNodes.append('circle')
      .attr('r', (d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        return idx !== undefined && idx === hoveredIndex ? leafSize + 2 : leafSize
      })
      .attr('fill', (d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        return idx !== undefined ? getLeafColor(idx, paletteName) : '#fda4af'
      })
      .attr('stroke', nodeStroke)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('filter', (d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        return idx !== undefined && idx === hoveredIndex ? 'url(#glow)' : 'none'
      })
      .on('click', (_event: any, d: any) => selectNode(d.data))
      .on('mouseenter', (_event: any, d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        if (idx !== undefined) setHovered(idx)
      })
      .on('mouseleave', () => setHovered(null))
  } else {
    leafNodes.append('path')
      .attr('d', (d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        const isHovered = idx !== undefined && idx === hoveredIndex
        const size = isHovered ? (leafSize + 2) * (leafSize + 2) * 2 : leafSize * leafSize * 2
        const type = treeSettings.leafShape === 'diamond' ? d3.symbolDiamond : d3.symbolSquare
        return d3.symbol().type(type).size(size)()
      })
      .attr('transform', 'translate(0,0)')
      .attr('fill', (d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        return idx !== undefined ? getLeafColor(idx, paletteName) : '#fda4af'
      })
      .attr('stroke', nodeStroke)
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', (_event: any, d: any) => selectNode(d.data))
      .on('mouseenter', (_event: any, d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        if (idx !== undefined) setHovered(idx)
      })
      .on('mouseleave', () => setHovered(null))
  }

  // Leaf labels
  if (treeSettings.showLabels) {
    leafNodes.append('text')
      .attr('dx', treeSettings.leafShape === 'circle' ? leafSize + 6 : leafSize * 2 + 4)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .style('font-size', `${treeSettings.labelSize}px`)
      .style('font-weight', '500')
      .style('fill', (d: any) => {
        const idx = leafIndexMap.get(d.data.id)
        return idx !== undefined && idx === hoveredIndex ? linkColorHover : textColor
      })
      .text((d: any) => {
        const name = d.data.name.replace(/[()]/g, '')
        return name.length > 20 ? name.slice(0, 18) + '\u2026' : name
      })
  }

  // Internal nodes
  const internalSize = Math.max(2, treeSettings.nodeSize - 2)
  node.filter((d: any) => !!d.children).append('circle')
    .attr('r', internalSize)
    .attr('fill', linkColorHover)
    .attr('stroke', nodeStroke)
    .attr('stroke-width', 1.5)
    .style('cursor', 'pointer')
    .on('click', (_event: any, d: any) => selectNode(d.data))

  // Distance labels
  if (treeSettings.showDistances) {
    node.filter((d: any) => d.children && (d.data as any).mergeDistance !== undefined)
      .append('text')
      .attr('dx', 0)
      .attr('dy', -internalSize - 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '8px')
      .style('font-family', 'var(--font-mono)')
      .style('fill', textColorMuted)
      .text((d: any) => {
        const dist = (d.data as any).mergeDistance
        return dist !== undefined ? dist.toFixed(3) : ''
      })
  }

  // Scale bar
  if (treeSettings.showScaleBar) {
    const maxDist = getMaxDistance(root)
    if (maxDist > 0) {
      const scaleWidth = w * 0.15
      const scaleValue = roundNice(maxDist * 0.2)
      const scaleG = svg.append('g')
        .attr('transform', `translate(${pad.left},${height - 12})`)

      scaleG.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', scaleWidth).attr('y2', 0)
        .attr('stroke', textColorMuted).attr('stroke-width', 1)

      scaleG.append('line')
        .attr('x1', 0).attr('y1', -3).attr('x2', 0).attr('y2', 3)
        .attr('stroke', textColorMuted).attr('stroke-width', 1)
      scaleG.append('line')
        .attr('x1', scaleWidth).attr('y1', -3).attr('x2', scaleWidth).attr('y2', 3)
        .attr('stroke', textColorMuted).attr('stroke-width', 1)

      scaleG.append('text')
        .attr('x', scaleWidth / 2).attr('y', -6)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .style('font-family', 'var(--font-mono)')
        .style('fill', textColorMuted)
        .text(scaleValue.toFixed(3))
    }
  }
}

function drawCircular(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  root: d3.HierarchyNode<TreeNode>,
  width: number,
  height: number,
  opts: DrawOpts,
) {
  const { textColor, linkColor, linkColorHover, nodeStroke, paletteName, selectNode, treeSettings } = opts

  const radius = Math.min(width, height) * 0.36
  const cluster = d3.cluster<TreeNode>().size([2 * Math.PI, radius])
  cluster(root)

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.2, 8])
    .on('zoom', (event) => {
      g.attr('transform', `translate(${width / 2},${height / 2}) ${event.transform}`)
    })
  svg.call(zoom)

  const allLeaves = root.leaves()
  const leafIndexMap = new Map<string, number>()
  allLeaves.forEach((leaf, i) => leafIndexMap.set(leaf.data.id, i))

  const toXY = (angle: number, r: number) => [
    r * Math.cos(angle - Math.PI / 2),
    r * Math.sin(angle - Math.PI / 2),
  ]

  // Links
  g.selectAll('.link')
    .data(root.links())
    .join('path')
    .attr('class', 'link')
    .attr('d', (d: any) => {
      const sa = d.source.x as number
      const sr = d.source.y as number
      const ta = d.target.x as number
      const tr = d.target.y as number
      const [sx, sy] = toXY(sa, sr)
      const [tx, ty] = toXY(ta, tr)
      const [mx, my] = toXY(sa, tr)
      return `M${sx},${sy}L${mx},${my}A${tr},${tr} 0 0,1 ${tx},${ty}`
    })
    .attr('fill', 'none')
    .attr('stroke', linkColor)
    .attr('stroke-width', treeSettings.branchWidth)
    .attr('stroke-linecap', 'round')

  // Leaf labels
  if (treeSettings.showLabels) {
    const labelG = g.selectAll('.label')
      .data(allLeaves)
      .join('g')
      .attr('class', 'label')
      .attr('transform', (d: any) => {
        const angle = d.x as number
        const r = d.y as number
        const deg = angle * 180 / Math.PI - 90
        const flip = deg > 90 && deg < 270
        return `rotate(${deg}) translate(${r + 10},0)${flip ? ' rotate(180)' : ''}`
      })

    labelG.append('text')
      .attr('text-anchor', (d: any) => {
        const deg = (d.x as number) * 180 / Math.PI - 90
        return (deg > 90 && deg < 270) ? 'end' : 'start'
      })
      .attr('dy', '0.35em')
      .style('font-size', `${treeSettings.labelSize - 1}px`)
      .style('font-weight', '500')
      .style('fill', textColor)
      .text((d: any) => {
        const name = d.data.name.replace(/[()]/g, '')
        return name.length > 18 ? name.slice(0, 16) + '\u2026' : name
      })
  }

  // Leaf dots
  g.selectAll('.leaf-dot')
    .data(allLeaves)
    .join('circle')
    .attr('r', treeSettings.nodeSize)
    .attr('cx', (d: any) => (d.y as number) * Math.cos((d.x as number) - Math.PI / 2))
    .attr('cy', (d: any) => (d.y as number) * Math.sin((d.x as number) - Math.PI / 2))
    .attr('fill', (d: any) => {
      const idx = leafIndexMap.get(d.data.id)
      return idx !== undefined ? getLeafColor(idx, paletteName) : '#fda4af'
    })
    .attr('stroke', nodeStroke)
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('click', (_event: any, d: any) => selectNode(d.data))

  // Internal nodes
  const internalSize = Math.max(1.5, treeSettings.nodeSize - 2)
  g.selectAll('.internal-dot')
    .data(root.descendants().filter(d => !!d.children))
    .join('circle')
    .attr('cx', (d: any) => (d.y as number) * Math.cos((d.x as number) - Math.PI / 2))
    .attr('cy', (d: any) => (d.y as number) * Math.sin((d.x as number) - Math.PI / 2))
    .attr('r', internalSize)
    .attr('fill', linkColorHover)
    .attr('stroke', nodeStroke)
    .attr('stroke-width', 1.5)
    .style('cursor', 'pointer')
    .on('click', (_event: any, d: any) => selectNode(d.data))

  // Guide circle
  if (treeSettings.showGuideCircle) {
    g.append('circle')
      .attr('r', radius * 0.33)
      .attr('fill', 'none')
      .attr('stroke', linkColor)
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,4')
      .attr('opacity', 0.4)
  }
}

function getMaxDistance(root: d3.HierarchyNode<TreeNode>): number {
  let max = 0
  root.descendants().forEach(d => {
    if ((d.data as any).mergeDistance !== undefined) {
      max = Math.max(max, (d.data as any).mergeDistance)
    }
  })
  return max
}

function roundNice(value: number): number {
  if (value <= 0) return 0
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const normalized = value / magnitude
  let nice: number
  if (normalized <= 1) nice = 1
  else if (normalized <= 2) nice = 2
  else if (normalized <= 5) nice = 5
  else nice = 10
  return nice * magnitude
}
