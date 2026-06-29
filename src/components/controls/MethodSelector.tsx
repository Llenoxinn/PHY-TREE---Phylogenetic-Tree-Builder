import { useTreeStore } from '../../store/tree-store'
import type { TreeMethod } from '../../types'
import { InfoIcon } from '../ui/Tooltip'

const METHOD_INFO: Record<TreeMethod, { label: string; desc: string }> = {
  upgma: {
    label: 'UPGMA',
    desc: 'Ultrametric. Assumes all lineages evolve at the same rate (molecular clock).',
  },
  'neighbor-joining': {
    label: 'NJ',
    desc: 'Additive. Corrects for unequal evolutionary rates between lineages.',
  },
}

export function MethodSelector() {
  const { method, setMethod } = useTreeStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Method</label>
        <InfoIcon tip="Algorithm used to construct the phylogenetic tree from distance matrix" />
      </div>
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
            {METHOD_INFO[m].label}
          </button>
        ))}
      </div>
      <div className="flex items-start gap-1.5 text-[10px] text-text-secondary leading-snug">
        <svg className="w-3 h-3 flex-shrink-0 mt-0.5 text-blush-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>{METHOD_INFO[method].desc}</span>
      </div>
    </div>
  )
}
