import { useAlignmentStore } from '../../store/alignment-store'
import { useSequenceStore } from '../../store/sequence-store'
import { useUIStore } from '../../store/ui-store'

export function PairwiseAlignmentViewer() {
  const { pairwiseAlignments, selectedPair, clearSelectedPair } = useAlignmentStore()
  const { sequences } = useSequenceStore()
  const { theme } = useUIStore()

  if (!selectedPair) return null

  const pair = pairwiseAlignments.find(p => p.i === selectedPair.i && p.j === selectedPair.j)
  if (!pair) return null

  const isDark = theme === 'dark'
  const labelA = sequences[pair.i]?.label ?? `Seq ${pair.i}`
  const labelB = sequences[pair.j]?.label ?? `Seq ${pair.j}`

  const chars = pair.alignedA.split('')
  const cols = chars.map((ch, idx) => ({
    a: ch,
    b: pair.alignedB[idx],
    match: ch === pair.alignedB[idx],
    gap: ch === '-' || pair.alignedB[idx] === '-',
  }))

  const identityGap = cols.filter(c => !c.gap).length
  const identity = identityGap > 0 ? cols.filter(c => c.match && !c.gap).length / identityGap * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Pairwise Alignment</span>
        <button onClick={clearSelectedPair} className="text-text-muted hover:text-text-primary transition-colors text-xs leading-none">&times;</button>
      </div>
      <div className="border border-border bg-surface-alt p-1.5">
        <div className="text-[9px] font-mono leading-relaxed" style={{ letterSpacing: '0.06em' }}>
          <div className="flex items-center gap-2">
            <span className="text-text-muted w-8 text-right flex-shrink-0">{labelA}</span>
            {cols.map((c, i) => (
              <span
                key={i}
                className={
                  c.gap
                    ? 'text-text-muted'
                    : c.match
                      ? isDark ? 'text-green-400' : 'text-green-700'
                      : isDark ? 'text-red-400' : 'text-red-600'
                }
              >
                {c.a}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-muted w-8 text-right flex-shrink-0">{labelB}</span>
            {cols.map((c, i) => (
              <span
                key={i}
                className={
                  c.gap
                    ? 'text-text-muted'
                    : c.match
                      ? isDark ? 'text-green-400' : 'text-green-700'
                      : isDark ? 'text-red-400' : 'text-red-600'
                }
              >
                {c.b}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-8 flex-shrink-0" />
            {cols.map((c, i) => (
              <span
                key={i}
                className={`text-[7px] ${c.match || c.gap ? 'opacity-0' : 'opacity-40'}`}
              >
                |
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-[9px] font-mono text-text-muted">
        <span>Score: <span className="text-text-primary">{pair.score}</span></span>
        <span>Distance: <span className="text-text-primary">{pair.distance.toFixed(4)}</span></span>
        <span>Identity: <span className="text-text-primary">{identity.toFixed(1)}%</span></span>
      </div>
    </div>
  )
}
