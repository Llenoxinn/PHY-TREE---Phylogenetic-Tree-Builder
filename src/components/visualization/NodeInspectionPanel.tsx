import { useTreeStore } from '../../store/tree-store'
import { useUIStore } from '../../store/ui-store'
import { useAlignmentStore } from '../../store/alignment-store'
import { useSequenceStore } from '../../store/sequence-store'

function getLeafNames(node: { name: string; children?: any[] }): string[] {
  if (!node.children || node.children.length === 0) return [node.name]
  return node.children.flatMap(getLeafNames)
}

function getLeafIndices(node: { children?: any[]; originalIndex?: number }): number[] {
  if (!node.children || node.children.length === 0) {
    return node.originalIndex !== undefined ? [node.originalIndex] : []
  }
  return node.children.flatMap(getLeafIndices)
}

export function NodeInspectionPanel() {
  const { selectedNode, selectNode } = useTreeStore()
  const { showNodePanel } = useUIStore()
  const { pairwiseAlignments } = useAlignmentStore()
  const { sequences } = useSequenceStore()

  if (!showNodePanel) return null
  if (!selectedNode) {
    return (
      <div className="text-[10px] text-text-muted italic p-2 border border-dashed border-border text-center">
        Click a node on the tree to inspect
      </div>
    )
  }

  const leaves = getLeafNames(selectedNode)
  const isLeaf = leaves.length === 1

  const children = selectedNode.children || []
  const childALeaves = children[0] ? getLeafIndices(children[0]) : []
  const childBLeaves = children[1] ? getLeafIndices(children[1]) : []

  const pair = childALeaves.length === 1 && childBLeaves.length === 1
    ? pairwiseAlignments.find(p =>
        (p.i === childALeaves[0] && p.j === childBLeaves[0]) ||
        (p.i === childBLeaves[0] && p.j === childALeaves[0])
      )
    : null

  return (
    <div className="space-y-2 border border-border p-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Inspector</span>
        <button onClick={() => selectNode(null)} className="text-text-muted hover:text-text-primary transition-colors text-xs leading-none">&times;</button>
      </div>
      <div className="space-y-1 text-[10px]">
        <Row label="Name" value={selectedNode.name.replace(/[()]/g, '')} mono />
        {selectedNode.mergeStep !== undefined && (
          <Row label="Step" value={`#${selectedNode.mergeStep}`} accent />
        )}
        {selectedNode.mergeDistance !== undefined && (
          <Row label="Distance" value={selectedNode.mergeDistance.toFixed(4)} mono accent />
        )}
        <Row label="Type" value={isLeaf ? 'Leaf' : 'Internal'} />
        {!isLeaf && (
          <div>
            <span className="text-text-muted">Contains: </span>
            <span className="text-text-secondary">{leaves.join(', ')}</span>
          </div>
        )}

        {pair && (
          <div className="pt-1.5 border-t border-border mt-1.5 space-y-1">
            <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest">Merge Alignment</span>
            <div className="font-mono text-[10px] leading-relaxed bg-surface-alt p-1 rounded" style={{ letterSpacing: '0.04em', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <div>
                <span className="text-text-muted">{sequences[pair.i]?.label}: </span>
                {pair.alignedA}
              </div>
              <div>
                <span className="text-text-muted">{sequences[pair.j]?.label}: </span>
                {pair.alignedB}
              </div>
            </div>
            <div className="flex gap-2 text-[9px] text-text-muted">
              <span>Score: {pair.score}</span>
              <span>Identity: {(
                pair.alignedA.split('').filter((ch, idx) => ch === pair.alignedB[idx] && ch !== '-').length /
                pair.alignedA.split('').filter(ch => ch !== '-').length * 100
              ).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div>
      <span className="text-text-muted">{label}: </span>
      <span className={`${mono ? 'font-mono' : ''} ${accent ? 'text-blush-600 dark:text-blush-400 font-medium' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  )
}
