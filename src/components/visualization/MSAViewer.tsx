import { useMemo } from 'react'
import { useTreeStore } from '../../store/tree-store'
import { useSequenceStore } from '../../store/sequence-store'
import { useAlignmentStore } from '../../store/alignment-store'
import { useUIStore } from '../../store/ui-store'
import { computeMSA, computeConservation, computeConsensus } from '../../lib/algorithms/progressive-msa'
import { SCORING_MATRICES } from '../../lib/algorithms/scoring-matrices'

export function MSAViewer() {
  const { fullTree } = useTreeStore()
  const { sequences } = useSequenceStore()
  const { matrixType, gapPenalty } = useAlignmentStore()
  const { showMSA, theme } = useUIStore()

  if (!showMSA || !fullTree || sequences.length < 2) return null

  const rawSeqs = useMemo(() => sequences.map(s => s.raw), [sequences])
  const scoring = useMemo(() => SCORING_MATRICES[matrixType], [matrixType])

  const msa = useMemo(
    () => {
      try {
        return computeMSA(fullTree, rawSeqs, scoring.matrix, gapPenalty)
      } catch {
        return null
      }
    },
    [fullTree, rawSeqs, scoring.matrix, gapPenalty],
  )

  if (!msa) return null

  const { aligned, labels } = msa
  const conservation = computeConservation(aligned)
  const consensus = computeConsensus(aligned)
  const cols = aligned[0].length
  const isDark = theme === 'dark'

  const seqColors = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
    '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  ]

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Multiple Sequence Alignment</label>
      <div className="border border-border bg-surface-alt overflow-x-auto max-h-72">
        <div className="font-mono text-[9px] leading-relaxed whitespace-nowrap p-1.5" style={{ letterSpacing: '0.04em' }}>
          {cols > 60 && (
            <div className="text-[7px] text-text-muted text-center pb-0.5 border-b border-border mb-0.5 sticky top-0 bg-surface-alt z-10">
              Scroll right for more columns ({cols} total)
            </div>
          )}
          <div className="flex items-center gap-1 mb-0.5 pb-0.5 border-b border-border sticky top-0 bg-surface-alt z-10">
            <span className="w-14 flex-shrink-0 text-text-muted">Pos</span>
            {Array.from({ length: cols }, (_, i) => (
              <span
                key={i}
                className={`inline-block w-2 text-center ${
                  conservation[i] >= 0.8
                    ? 'text-text-primary font-medium'
                    : conservation[i] >= 0.4
                      ? 'text-text-secondary'
                      : 'text-text-muted'
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
          {aligned.map((seq, si) => {
            const origIdx = labels[si]
            const color = seqColors[origIdx % seqColors.length]
            const label = sequences[origIdx]?.label ?? `S${origIdx}`
            return (
              <div key={si} className="flex items-center gap-1 hover:bg-surface-hover">
                <span className="w-14 flex-shrink-0 truncate text-text-muted" title={label} style={{ color: label.length > 10 ? undefined : color }}>
                  {label.length > 10 ? label.slice(0, 9) + '\u2026' : label}
                </span>
                {seq.split('').map((ch, ci) => {
                  const cons = conservation[ci]
                  let bg = 'transparent'
                  if (ch !== '-') {
                    if (cons >= 0.8) bg = isDark ? 'rgba(74, 222, 128, 0.25)' : 'rgba(22, 163, 74, 0.2)'
                    else if (cons >= 0.4) bg = isDark ? 'rgba(250, 204, 21, 0.15)' : 'rgba(234, 179, 8, 0.15)'
                  } else {
                    bg = isDark ? 'rgba(100, 116, 139, 0.15)' : 'rgba(200, 200, 200, 0.3)'
                  }
                  return (
                    <span
                      key={ci}
                      className="inline-block w-2 text-center"
                      style={{
                        backgroundColor: bg,
                        color: ch === '-' ? (isDark ? '#64748b' : '#adb5bd') : undefined,
                      }}
                    >
                      {ch}
                    </span>
                  )
                })}
              </div>
            )
          })}
          <div className="flex items-center gap-1 mt-1 pt-0.5 border-t border-border">
            <span className="w-14 flex-shrink-0 text-text-muted text-[7px]">Consensus</span>
            {consensus.split('').map((ch, ci) => (
              <span
                key={ci}
                className="inline-block w-2 text-center text-text-secondary text-[8px]"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[9px] text-text-muted">
        <span>{aligned.length} sequences</span>
        <span>{cols} columns</span>
        <span>{(conservation.filter(c => c >= 0.8).length / cols * 100).toFixed(1)}% conserved</span>
      </div>
    </div>
  )
}
