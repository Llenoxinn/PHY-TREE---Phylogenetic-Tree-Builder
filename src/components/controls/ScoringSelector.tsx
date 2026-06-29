import { useAlignmentStore } from '../../store/alignment-store'
import { SCORING_MATRICES } from '../../lib/algorithms/scoring-matrices'
import type { ScoringMatrixType } from '../../types'

export function ScoringSelector() {
  const { matrixType, gapPenalty, setMatrixType, setGapPenalty } = useAlignmentStore()

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="text-sm font-medium">Scoring Matrix</label>
        <select
          value={matrixType}
          onChange={(e) => setMatrixType(e.target.value as ScoringMatrixType)}
          className="w-full text-xs px-2 py-1.5 border rounded"
        >
          {Object.entries(SCORING_MATRICES).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label className="font-medium">Gap Penalty</label>
          <span className="text-gray-500">{gapPenalty}</span>
        </div>
        <input
          type="range"
          min="-20"
          max="-1"
          step={1}
          value={gapPenalty}
          onChange={(e) => setGapPenalty(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
