import { useTreeStore } from '../../store/tree-store'

const EXPLANATIONS: Record<string, { title: string; desc: string; formula: { parts: string[] } }> = {
  upgma: {
    title: 'UPGMA',
    desc: 'Hierarchical clustering assuming a constant molecular clock. At each step, the two closest clusters are merged. Distances to the new cluster are computed as a weighted average.',
    formula: {
      parts: [
        'd(ij, k)',
        '=',
        'n\u1d62 \u00b7 d(ik) + n\u2c6c \u00b7 d(jk)',
        '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
        'n\u1d62 + n\u2c6c',
      ],
    },
  },
  'neighbor-joining': {
    title: 'Neighbor-Joining',
    desc: 'Finds the pair of neighbors that minimizes total branch length. Corrects for unequal evolutionary rates by subtracting rate estimates before selecting neighbors.',
    formula: {
      parts: [
        'D(ij, k)',
        '=',
        'D(ik) + D(jk) \u2212 D(ij)',
        '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
        '2',
      ],
    },
  },
}

export function AlgorithmExplainer() {
  const { method, currentStep, steps } = useTreeStore()
  const info = EXPLANATIONS[method]

  if (!info) return null

  return (
    <div className="border border-border p-3 space-y-3">
      <div>
        <span className="text-xs font-semibold text-text-primary">{info.title}</span>
        <p className="text-xs text-text-secondary leading-relaxed mt-1">{info.desc}</p>
      </div>

      <div className="bg-surface-hover border border-border p-3">
        <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-2">Formula</span>
        <div className="flex flex-col items-center font-mono text-sm text-text-primary leading-tight">
          <span>{info.formula.parts[0]} {info.formula.parts[1]} {info.formula.parts[2]}</span>
          <span className="text-text-muted text-[11px] tracking-widest">{info.formula.parts[3]}</span>
          <span>{info.formula.parts[4]}</span>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="border-t border-border pt-2">
          <span className="text-[10px] text-text-muted font-mono">
            Step {currentStep} of {steps.length - 1}
          </span>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {steps[currentStep]?.description}
          </p>
        </div>
      )}
    </div>
  )
}
