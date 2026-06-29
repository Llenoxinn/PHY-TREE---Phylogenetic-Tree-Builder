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
      <div className="text-xs text-gray-400 italic p-3 border border-dashed border-blush-200 rounded-xl bg-blush-50/30 text-center">
        Click a node on the tree to inspect its details
      </div>
    )
  }

  const leaves = getLeafNames(selectedNode)
  const isLeaf = leaves.length === 1

  return (
    <div className="space-y-2 p-3 border border-blush-100 rounded-xl bg-blush-50/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-blush-600">Node Inspector</span>
        <button onClick={() => selectNode(null)} className="text-gray-400 hover:text-blush-600 transition-colors text-sm">✕</button>
      </div>
      <div className="space-y-1.5 text-xs">
        <div>
          <span className="text-gray-500">Label: </span>
          <span className="font-mono text-gray-800 font-medium">{selectedNode.name.replace(/[()]/g, '')}</span>
        </div>
        {selectedNode.mergeStep !== undefined && (
          <div>
            <span className="text-gray-500">Merge Step: </span>
            <span className="text-blush-600 font-bold">#{selectedNode.mergeStep}</span>
          </div>
        )}
        {selectedNode.mergeDistance !== undefined && (
          <div>
            <span className="text-gray-500">Distance: </span>
            <span className="text-blush-600 font-bold font-mono">{selectedNode.mergeDistance.toFixed(4)}</span>
          </div>
        )}
        <div>
          <span className="text-gray-500">Type: </span>
          <span className={isLeaf ? 'text-blush-500' : 'text-gray-800'}>{isLeaf ? 'Leaf (taxon)' : 'Internal (clade)'}</span>
        </div>
        {!isLeaf && (
          <div>
            <span className="text-gray-500">Contains: </span>
            <span className="text-gray-700">{leaves.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
