import { useTreeStore } from '../../store/tree-store'
import { useUIStore } from '../../store/ui-store'

function getLeafNames(node: { name: string; children?: any[] }): string[] {
  if (!node.children || node.children.length === 0) return [node.name]
  return node.children.flatMap(getLeafNames)
}

export function NodeInspectionPanel() {
  const { selectedNode, selectNode } = useTreeStore()
  const { showNodePanel } = useUIStore()

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
