import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { useTreeStore } from '../../store/tree-store'
import { useSequenceStore } from '../../store/sequence-store'
import { useUIStore } from '../../store/ui-store'
import { getLeafColor } from '../../lib/utils/colors'
import type { TreeNode } from '../../types'

function computeLayout(
  treeData: TreeNode,
  layoutType: 'rectangular' | 'circular',
  width: number,
  height: number,
) {
  const root = d3.hierarchy(treeData)
  const tree = d3.cluster<TreeNode>()
    .size(layoutType === 'circular'
      ? [2 * Math.PI, Math.min(width, height) * 0.35]
      : [width - 100, height - 80])
  tree(root)
  return root
}

export function TreeCanvas() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { steps, currentStep, layoutType, selectNode } = useTreeStore()
  const { setHovered } = useSequenceStore()
  const { palette } = useUIStore()

  const treeData = steps[currentStep]?.treeState ?? null

  const draw = useCallback(() => {
    const svgEl = svgRef.current
    const container = containerRef.current
    if (!svgEl || !container || !treeData) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 400

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('class', 'tree-group')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)

    const root = computeLayout(treeData, layoutType, width, height)
    const isCircular = layoutType === 'circular'

    const allLeaves = root.leaves()
    const leafIndexMap = new Map<string, number>()
    allLeaves.forEach((leaf, i) => {
      leafIndexMap.set(leaf.data.id, i)
    })

    g.selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        if (isCircular) {
          const source = d.source as any
          const target = d.target as any
          const r = target.y || 0
          const a = target.x || 0
          const sr = source.y || 0
          const sa = source.x || 0
          return `M${sr * Math.cos(sa - Math.PI / 2)},${sr * Math.sin(sa - Math.PI / 2)}A${r},${r} 0 0,1 ${r * Math.cos(a - Math.PI / 2)},${r * Math.sin(a - Math.PI / 2)}`
        }
        const sx = (d.source as any).y || 0
        const sy = (d.source as any).x || 0
        const tx = (d.target as any).y || 0
        const ty = (d.target as any).x || 0
        return `M${sx},${sy}C${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`
      })
      .attr('fill', 'none')
      .attr('stroke', '#bbb')
      .attr('stroke-width', 1.5)

    const node = g.selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => {
        const x = d.x || 0
        const y = d.y || 0
        if (isCircular) {
          return `rotate(${x * 180 / Math.PI - 90}) translate(${y},0)`
        }
        return `translate(${y},${x})`
      })
      .style('cursor', 'pointer')

    node.append('circle')
      .attr('r', (d: any) => d.children ? 4 : 3)
      .attr('fill', (d: any) => {
        if (!d.children) {
          const idx = leafIndexMap.get(d.data.id)
          return idx !== undefined ? getLeafColor(idx, palette) : '#666'
        }
        return '#666'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

    node.append('text')
      .attr('dx', (d: any) => isCircular ? 0 : (d.children ? -8 : 8))
      .attr('dy', (d: any) => isCircular ? (d.children ? -8 : 8) : 4)
      .attr('text-anchor', (d: any) => {
        if (isCircular) return d.children ? 'middle' : 'start'
        return d.children ? 'end' : 'start'
      })
      .style('font-size', '10px')
      .style('font-family', 'monospace')
      .text((d: any) => {
        const name = d.data.name.replace(/[()]/g, '')
        return name.length > 20 ? name.slice(0, 18) + '\u2026' : name
      })

    node.on('click', (_event: any, d: any) => {
      selectNode(d.data)
    })

    node.on('mouseenter', (_event: any, d: any) => {
      if (!d.children) {
        const idx = leafIndexMap.get(d.data.id)
        if (idx !== undefined) setHovered(idx)
      }
    })
    node.on('mouseleave', () => setHovered(null))

  }, [treeData, layoutType, selectNode, setHovered, palette])

  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    const observer = new ResizeObserver(() => draw())
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [draw])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}
