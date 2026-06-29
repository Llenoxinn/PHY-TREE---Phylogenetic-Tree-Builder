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
      <div className="text-xs text-text-muted italic p-3 border border-dashed border-border rounded-xl bg-surface text-center">
        Click a node on the tree to inspect its details
      </div>
    )
  }

  const leaves = getLeafNames(selectedNode)
  const isLeaf = leaves.length === 1

  return (
    <div className="space-y-2 p-3 border border-border rounded-xl bg-blush-50/30 dark:bg-blush-900/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-blush-600 dark:text-blush-400">Node Inspector</span>
        <button onClick={() => selectNode(null)} className="text-text-muted hover:text-blush-600 dark:hover:text-blush-400 transition-colors text-sm">✕</button>
      </div>
      <div className="space-y-1.5 text-xs">
        <div>
          <span className="text-text-muted">Label: </span>
          <span className="font-mono text-text-primary font-medium">{selectedNode.name.replace(/[()]/g, '')}</span>
        </div>
        {selectedNode.mergeStep !== undefined && (
          <div>
            <span className="text-text-muted">Merge Step: </span>
            <span className="text-blush-600 dark:text-blush-400 font-bold">#{selectedNode.mergeStep}</span>
          </div>
        )}
        {selectedNode.mergeDistance !== undefined && (
          <div>
            <span className="text-text-muted">Distance: </span>
            <span className="text-blush-600 dark:text-blush-400 font-bold font-mono">{selectedNode.mergeDistance.toFixed(4)}</span>
          </div>
        )}
        <div>
          <span className="text-text-muted">Type: </span>
          <span className={isLeaf ? 'text-blush-500 dark:text-blush-400' : 'text-text-primary'}>{isLeaf ? 'Leaf (taxon)' : 'Internal (clade)'}</span>
        </div>
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
