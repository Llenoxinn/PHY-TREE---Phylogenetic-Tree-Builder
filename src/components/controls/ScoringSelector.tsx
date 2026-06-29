import { useAlignmentStore } from '../../store/alignment-store'
import { SCORING_MATRICES } from '../../lib/algorithms/scoring-matrices'
import type { ScoringMatrixType } from '../../types'

export function ScoringSelector() {
  const { matrixType, gapPenalty, setMatrixType, setGapPenalty } = useAlignmentStore()

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-blush-600">Scoring Matrix</label>
        <select
          value={matrixType}
          onChange={(e) => setMatrixType(e.target.value as ScoringMatrixType)}
          className="w-full text-xs px-3 py-2 border border-blush-100 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blush-300"
        >
          {Object.entries(SCORING_MATRICES).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label className="font-semibold text-blush-600">Gap Penalty</label>
          <span className="text-blush-500 font-mono font-bold">{gapPenalty}</span>
        </div>
        <input
          type="range"
          min="-20"
          max="-1"
          step={1}
          value={gapPenalty}
          onChange={(e) => setGapPenalty(Number(e.target.value))}
          className="w-full h-1.5 bg-blush-100 rounded-full appearance-none cursor-pointer accent-blush-500"
        />
      </div>
    </div>
  )
}
