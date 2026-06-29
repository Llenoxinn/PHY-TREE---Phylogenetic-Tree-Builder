import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { useTreeStore } from '../../store/tree-store'
import { useSequenceStore } from '../../store/sequence-store'
import { useUIStore } from '../../store/ui-store'
import { getLeafColor } from '../../lib/utils/colors'
import type { TreeNode } from '../../types'

export function TreeCanvas() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { steps, currentStep, layoutType, selectNode } = useTreeStore()
  const { setHovered } = useSequenceStore()
  const { palette, theme } = useUIStore()

  const treeData = steps[currentStep]?.treeState ?? null

  const draw = useCallback(() => {
    const svgEl = svgRef.current
    const container = containerRef.current
    if (!svgEl || !container || !treeData) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 400
    const isCircular = layoutType === 'circular'
    const isDark = theme === 'dark'

    const textColor = isDark ? '#e8e4f0' : '#374151'
    const linkColor = isDark ? '#3d3860' : '#ddd'
    const mutedColor = isDark ? '#6b6580' : '#9ca3af'
    const nodeStroke = isDark ? '#1e1b2e' : '#fff'

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'branch-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%')
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#fecdd3')
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f43f5e')

    const root = d3.hierarchy(treeData)

    if (isCircular) {
      const radius = Math.min(width, height) * 0.38
      const cluster = d3.cluster<TreeNode>().size([2 * Math.PI, radius])
      cluster(root)

      const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
          g.attr('transform', `translate(${width / 2},${height / 2}) ${event.transform}`)
        })
      svg.call(zoom)

      const allLeaves = root.leaves()
      const leafIndexMap = new Map<string, number>()
      allLeaves.forEach((leaf, i) => leafIndexMap.set(leaf.data.id, i))

      g.selectAll('.link')
        .data(root.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', (d: any) => {
          const sa = d.source.x as number
          const sr = d.source.y as number
          const ta = d.target.x as number
          const tr = d.target.y as number
          const toXY = (a: number, r: number) => [
            r * Math.cos(a - Math.PI / 2),
            r * Math.sin(a - Math.PI / 2),
          ]
          const [sx, sy] = toXY(sa, sr)
          const [tx, ty] = toXY(ta, tr)
          const [mx, my] = toXY(sa, tr)
          return `M${sx},${sy}L${mx},${my}A${tr},${tr} 0 0,1 ${tx},${ty}`
        })
        .attr('fill', 'none')
        .attr('stroke', linkColor)
        .attr('stroke-width', 1.5)

      const labelG = g.selectAll('.label')
        .data(root.leaves())
        .join('g')
        .attr('class', 'label')
        .attr('transform', (d: any) => {
          const angle = d.x as number
          const r = d.y as number
          const deg = angle * 180 / Math.PI - 90
          const flip = deg > 90 && deg < 270
          return `rotate(${deg}) translate(${r + 8},0)${flip ? ' rotate(180)' : ''}`
        })

      labelG.append('text')
        .attr('text-anchor', (d: any) => {
          const deg = (d.x as number) * 180 / Math.PI - 90
          return (deg > 90 && deg < 270) ? 'end' : 'start'
        })
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .style('font-family', 'var(--font-sans)')
        .style('font-weight', '500')
        .style('fill', textColor)
        .text((d: any) => {
          const name = d.data.name.replace(/[()]/g, '')
          return name.length > 25 ? name.slice(0, 23) + '\u2026' : name
        })

      g.selectAll('.color-arc')
        .data(root.leaves())
        .join('circle')
        .attr('r', 3)
        .attr('cx', (d: any) => (d.y as number) * Math.cos((d.x as number) - Math.PI / 2))
        .attr('cy', (d: any) => (d.y as number) * Math.sin((d.x as number) - Math.PI / 2))
        .attr('fill', (d: any) => {
          const idx = leafIndexMap.get(d.data.id)
          return idx !== undefined ? getLeafColor(idx, palette) : '#fda4af'
        })
        .attr('stroke', nodeStroke)
        .attr('stroke-width', 1.5)

      g.selectAll('.node-circle')
        .data(root.descendants().filter(d => !!d.children))
        .join('circle')
        .attr('cx', (d: any) => (d.y as number) * Math.cos((d.x as number) - Math.PI / 2))
        .attr('cy', (d: any) => (d.y as number) * Math.sin((d.x as number) - Math.PI / 2))
        .attr('r', 2.5)
        .attr('fill', '#f43f5e')
        .attr('stroke', nodeStroke)
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('click', (_event: any, d: any) => selectNode(d.data))

    } else {
      const cluster = d3.cluster<TreeNode>()
        .size([height - 60, width - 180])
      cluster(root)

      const g = svg.append('g').attr('transform', 'translate(80, 30)')

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
          g.attr('transform', `translate(80,30) ${event.transform}`)
        })
      svg.call(zoom)

      const allLeaves = root.leaves()
      const leafIndexMap = new Map<string, number>()
      allLeaves.forEach((leaf, i) => leafIndexMap.set(leaf.data.id, i))

      g.selectAll('.link')
        .data(root.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', (d: any) => {
          const sx = d.source.y as number
          const sy = d.source.x as number
          const tx = d.target.y as number
          const ty = d.target.x as number
          return `M${sx},${sy}H${tx}V${ty}`
        })
        .attr('fill', 'none')
        .attr('stroke', linkColor)
        .attr('stroke-width', 1.5)

      const node = g.selectAll('.node')
        .data(root.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`)
        .style('cursor', 'pointer')

      node.append('circle')
        .attr('r', (d: any) => d.children ? 3.5 : 5)
        .attr('fill', (d: any) => {
          if (!d.children) {
            const idx = leafIndexMap.get(d.data.id)
            return idx !== undefined ? getLeafColor(idx, palette) : '#fda4af'
          }
          return '#f43f5e'
        })
        .attr('stroke', nodeStroke)
        .attr('stroke-width', 1.5)
        .on('click', (_event: any, d: any) => selectNode(d.data))
        .on('mouseenter', (_event: any, d: any) => {
          if (!d.children) {
            const idx = leafIndexMap.get(d.data.id)
            if (idx !== undefined) setHovered(idx)
          }
        })
        .on('mouseleave', () => setHovered(null))

      node.filter((d: any) => !d.children)
        .append('text')
        .attr('dx', 10)
        .attr('dy', 4)
        .attr('text-anchor', 'start')
        .style('font-size', '11px')
        .style('font-family', 'var(--font-sans)')
        .style('font-weight', '500')
        .style('fill', textColor)
        .text((d: any) => {
          const name = d.data.name.replace(/[()]/g, '')
          return name.length > 25 ? name.slice(0, 23) + '\u2026' : name
        })

      node.filter((d: any) => d.children && (d.data as any).mergeDistance !== undefined)
        .append('text')
        .attr('dx', -6)
        .attr('dy', -8)
        .attr('text-anchor', 'end')
        .style('font-size', '8px')
        .style('font-family', 'var(--font-mono)')
        .style('fill', mutedColor)
        .text((d: any) => (d.data as any).mergeDistance?.toFixed(3) ?? '')
    }

  }, [treeData, layoutType, selectNode, setHovered, palette, theme])

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
