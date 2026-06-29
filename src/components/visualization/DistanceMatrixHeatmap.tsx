import { useAlignmentStore } from '../../store/alignment-store'
import { useTreeStore } from '../../store/tree-store'
import { useUIStore } from '../../store/ui-store'
import { useSequenceStore } from '../../store/sequence-store'

export function DistanceMatrixHeatmap() {
  const { distanceMatrix } = useAlignmentStore()
  const { steps, currentStep } = useTreeStore()
  const { showHeatmap } = useUIStore()
  const { sequences } = useSequenceStore()
  const labels = sequences.map(s => s.label)

  if (!showHeatmap || distanceMatrix.length === 0) return null

  const displayMatrix = steps[currentStep]?.matrixSnapshot || distanceMatrix
  const displayLabels = labels.length === displayMatrix.length ? labels : displayMatrix.map((_: any, i: number) => `Seq ${i + 1}`)
  const maxVal = Math.max(1, ...displayMatrix.flat())

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-blush-600 dark:text-blush-400">Distance Matrix</label>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="text-[10px] font-mono border-collapse w-full">
          <thead>
            <tr>
              <th className="p-1.5 bg-surface" />
              {displayLabels.map((l: string, i: number) => (
                <th key={i} className="p-1.5 bg-surface font-medium text-blush-600 dark:text-blush-400 max-w-12 truncate" title={l}>
                  {l.length > 6 ? l.slice(0, 5) + '\u2026' : l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMatrix.map((row: number[], i: number) => (
              <tr key={i}>
                <td className="p-1.5 font-medium text-blush-600 dark:text-blush-400 bg-surface max-w-12 truncate text-right" title={displayLabels[i]}>
                  {displayLabels[i].length > 6 ? displayLabels[i].slice(0, 5) + '\u2026' : displayLabels[i]}
                </td>
                {row.map((val: number, j: number) => {
                  const intensity = maxVal > 0 ? val / maxVal : 0
                  return (
                    <td
                      key={j}
                      className="p-1 text-center min-w-[1.8rem] border-l border-border"
                      style={{
                        backgroundColor: `rgba(253, 164, 175, ${intensity * 0.8 + 0.05})`,
                        color: intensity > 0.6 ? '#9f1239' : 'var(--color-text-secondary)',
                      }}
                    >
                      {val.toFixed(2)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
