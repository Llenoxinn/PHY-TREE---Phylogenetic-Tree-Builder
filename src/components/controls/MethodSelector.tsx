import { useTreeStore } from '../../store/tree-store'
import type { TreeMethod } from '../../types'

export function MethodSelector() {
  const { method, setMethod } = useTreeStore()

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-blush-600">Tree Method</label>
      <div className="flex gap-1 p-1 bg-blush-50 rounded-xl">
        {(['upgma', 'neighbor-joining'] as TreeMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              method === m ? 'bg-white shadow-sm text-blush-600 shadow-blush-100' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m === 'upgma' ? 'UPGMA' : 'Neighbor-Joining'}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 leading-relaxed">
        {method === 'upgma' ? 'Ultrametric — assumes clock-like evolution' : 'Additive — more biologically accurate'}
      </p>
    </div>
  )
}
