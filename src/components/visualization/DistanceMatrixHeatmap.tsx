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
  const displayLabels = labels.length === displayMatrix.length ? labels : displayMatrix.map((_, i) => `Seq ${i + 1}`)

  const maxVal = Math.max(1, ...displayMatrix.flat())

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Distance Matrix</label>
      <div className="overflow-x-auto">
        <table className="text-[10px] font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-1" />
              {displayLabels.map((l: string, i: number) => (
                <th key={i} className="p-1 font-medium text-gray-500 max-w-16 truncate" title={l}>
                  {l.length > 6 ? l.slice(0, 5) + '…' : l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMatrix.map((row: number[], i: number) => (
              <tr key={i}>
                <td className="p-1 font-medium text-gray-500 max-w-16 truncate text-right" title={displayLabels[i]}>
                  {displayLabels[i].length > 6 ? displayLabels[i].slice(0, 5) + '…' : displayLabels[i]}
                </td>
                {row.map((val: number, j: number) => {
                  const intensity = maxVal > 0 ? val / maxVal : 0
                  return (
                    <td
                      key={j}
                      className="p-1 text-center min-w-[2rem]"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                        color: intensity > 0.5 ? 'white' : 'black',
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
