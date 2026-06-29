import { useTreeStore } from '../../store/tree-store'

const EXPLANATIONS: Record<string, { title: string; desc: string; formula?: string }> = {
  upgma: {
    title: 'UPGMA',
    desc: 'Hierarchical clustering assuming constant molecular clock. Merges closest clusters, updating distances via weighted average.',
    formula: 'd(ij,k) = (n_i * d_ik + n_j * d_jk) / (n_i + n_j)',
  },
  'neighbor-joining': {
    title: 'Neighbor-Joining',
    desc: 'Minimizes total branch length. Corrects for unequal rates by subtracting rate estimates from the distance matrix.',
    formula: 'D(ij,k) = (D_ik + D_jk - D_ij) / 2',
  },
}

export function AlgorithmExplainer() {
  const { method, currentStep, steps } = useTreeStore()
  const info = EXPLANATIONS[method]

  if (!info) return null

  return (
    <div className="space-y-2 border border-border p-2">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">{info.title}</span>
        </div>
        <p className="text-[10px] text-text-secondary leading-relaxed">{info.desc}</p>
        {info.formula && (
          <code className="block mt-1 text-[10px] font-mono text-blush-500 dark:text-blush-400 bg-blush-50/30 dark:bg-blush-900/10 px-1.5 py-0.5">
            {info.formula}
          </code>
        )}
      </div>
      {steps.length > 0 && (
        <div className="border-t border-border pt-2">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[10px] font-mono text-text-muted">
              Step {currentStep}/{steps.length - 1}
            </span>
          </div>
          <p className="text-[10px] text-text-secondary">
            {steps[currentStep]?.description}
          </p>
        </div>
      )}
    </div>
  )
}
