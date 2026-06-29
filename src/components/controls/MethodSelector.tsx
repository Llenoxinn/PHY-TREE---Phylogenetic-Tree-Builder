import { useTreeStore } from '../../store/tree-store'
import type { TreeMethod } from '../../types'

export function MethodSelector() {
  const { method, setMethod } = useTreeStore()

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Method</label>
      <div className="flex border border-border">
        {(['upgma', 'neighbor-joining'] as TreeMethod[]).map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 px-2 py-1.5 text-[11px] font-medium transition-colors ${
              method === m
                ? 'bg-blush-500 text-white'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {m === 'upgma' ? 'UPGMA' : 'NJ'}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-text-muted font-mono">
        {method === 'upgma' ? 'ultrametric' : 'additive'}
      </p>
    </div>
  )
}
