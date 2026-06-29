import { useTreeStore } from '../../store/tree-store'
import type { TreeMethod } from '../../types'

export function MethodSelector() {
  const { method, setMethod, buildTree } = useTreeStore()

  const handleChange = (m: TreeMethod) => {
    setMethod(m)
    const state = useTreeStore.getState()
    if (state.steps.length > 0) {
      const { labels, distanceMatrix } = (window as any).__lastBuildParams || {}
      if (labels && distanceMatrix) buildTree(labels, distanceMatrix)
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Tree Method</label>
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg">
        {(['upgma', 'neighbor-joining'] as TreeMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => handleChange(m)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              method === m ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m === 'upgma' ? 'UPGMA' : 'Neighbor-Joining'}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-400">
        {method === 'upgma' ? 'Ultrametric — assumes clock-like evolution' : 'Additive — more biologically accurate'}
      </p>
    </div>
  )
}
