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
      <div className="text-xs text-gray-400 italic p-2 border rounded bg-gray-50">
        Click a node on the tree to inspect
      </div>
    )
  }

  const leaves = getLeafNames(selectedNode)
  const isLeaf = leaves.length === 1

  return (
    <div className="space-y-2 p-2 border rounded bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Node Inspection</span>
        <button onClick={() => selectNode(null)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-gray-500">Label: </span>
          <span className="font-mono">{selectedNode.name.replace(/[()]/g, '')}</span>
        </div>
        {selectedNode.mergeStep !== undefined && (
          <div>
            <span className="text-gray-500">Merge Step: </span>
            <span>{selectedNode.mergeStep}</span>
          </div>
        )}
        {selectedNode.mergeDistance !== undefined && (
          <div>
            <span className="text-gray-500">Merge Distance: </span>
            <span>{selectedNode.mergeDistance.toFixed(4)}</span>
          </div>
        )}
        <div>
          <span className="text-gray-500">Type: </span>
          <span>{isLeaf ? 'Leaf (taxon)' : 'Internal node (clade)'}</span>
        </div>
        {!isLeaf && (
          <div>
            <span className="text-gray-500">Contains: </span>
            <span>{leaves.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
