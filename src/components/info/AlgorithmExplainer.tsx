import { useTreeStore } from '../../store/tree-store'

const EXPLANATIONS: Record<string, {
  title: string
  fullName: string
  desc: string
  numerator: string
  denominator: string
  variables: { symbol: string; meaning: string }[]
}> = {
  upgma: {
    title: 'UPGMA',
    fullName: 'Unweighted Pair Group Method with Arithmetic Mean',
    desc: 'Simple hierarchical clustering that assumes a constant molecular clock. At each step, the two closest clusters are merged into a new cluster. The distance from the new cluster to any other cluster is the weighted average of the distances from the two merged clusters.',
    numerator: 'n\u1d62 \u00b7 d(ik) + n\u2c6c \u00b7 d(jk)',
    denominator: 'n\u1d62 + n\u2c6c',
    variables: [
      { symbol: 'n\u1d62', meaning: 'size of cluster i' },
      { symbol: 'n\u2c6c', meaning: 'size of cluster j' },
      { symbol: 'd(ik)', meaning: 'distance between cluster i and k' },
      { symbol: 'd(jk)', meaning: 'distance between cluster j and k' },
    ],
  },
  'neighbor-joining': {
    title: 'Neighbor-Joining',
    fullName: 'Neighbor-Joining Algorithm',
    desc: 'Distance-based method that does not assume equal evolutionary rates. At each step, it selects a pair of neighbors that minimizes the total branch length of the tree. The resulting tree is additive, with branch lengths proportional to evolutionary distance.',
    numerator: 'D(ik) + D(jk) \u2212 D(ij)',
    denominator: '2',
    variables: [
      { symbol: 'D(ik)', meaning: 'distance between taxa i and k' },
      { symbol: 'D(jk)', meaning: 'distance between taxa j and k' },
      { symbol: 'D(ij)', meaning: 'distance between taxa i and j' },
    ],
  },
}

export function AlgorithmExplainer() {
  const { method, currentStep, steps } = useTreeStore()
  const info = EXPLANATIONS[method]

  if (!info) return null

  return (
    <div className="border border-border p-3 space-y-3">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-text-primary" style={{ fontFamily: 'var(--font-sans)' }}>{info.title}</span>
        </div>
        <p className="text-[10px] text-text-muted mt-0.5 italic" style={{ fontFamily: 'var(--font-sans)' }}>
          {info.fullName}
        </p>
        <p className="text-xs text-text-secondary leading-relaxed mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
          {info.desc}
        </p>
      </div>

      <div className="bg-surface-hover border border-border p-3">
        <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-2 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
          Distance Formula
        </span>
        <div className="flex flex-col items-center py-2" style={{ fontFamily: "'Crimson Pro', 'Times New Roman', serif" }}>
          <span className="text-lg text-text-primary">
            {info.numerator}
          </span>
          <div className="w-48 h-px bg-text-muted my-1.5" />
          <span className="text-lg text-text-primary">
            {info.denominator}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-border space-y-0.5">
          {info.variables.map(v => (
            <div key={v.symbol} className="flex items-center gap-2 text-[10px]" style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="font-mono text-text-primary w-12 text-right">{v.symbol}</span>
              <span className="text-text-muted">=</span>
              <span className="text-text-secondary">{v.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {steps.length > 0 && (
        <div className="border-t border-border pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-text-muted" style={{ fontFamily: 'var(--font-sans)' }}>
              Progress
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              {currentStep}/{steps.length - 1}
            </span>
          </div>
          <div className="relative h-1 bg-border rounded-full overflow-hidden mb-2">
            <div
              className="absolute h-full bg-blush-500 rounded-full transition-all duration-200"
              style={{ width: `${steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
            {steps[currentStep]?.description}
          </p>
        </div>
      )}
    </div>
  )
}
