import { useAlignmentStore } from '../../store/alignment-store'
import { SCORING_MATRICES } from '../../lib/algorithms/scoring-matrices'
import type { ScoringMatrixType } from '../../types'

export function ScoringSelector() {
  const { matrixType, gapPenalty, setMatrixType, setGapPenalty } = useAlignmentStore()

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Scoring</label>
      <select
        value={matrixType}
        onChange={(e) => setMatrixType(e.target.value as ScoringMatrixType)}
        className="w-full text-[11px] px-2 py-1.5 border border-border rounded bg-surface text-text-primary focus:outline-none focus:border-blush-400"
      >
        {Object.entries(SCORING_MATRICES).map(([key, val]) => (
          <option key={key} value={key}>{val.name}</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-text-muted">Gap</span>
        <input
          type="range"
          min="-20"
          max="-1"
          step={1}
          value={gapPenalty}
          onChange={(e) => setGapPenalty(Number(e.target.value))}
          className="flex-1 h-1 bg-border rounded appearance-none cursor-pointer accent-blush-500"
        />
        <span className="text-[10px] text-blush-500 dark:text-blush-400 font-mono w-6 text-right">{gapPenalty}</span>
      </div>
    </div>
  )
}
