import { useAlignmentStore } from '../../store/alignment-store'
import { useTreeStore } from '../../store/tree-store'
import { useUIStore } from '../../store/ui-store'
import { useSequenceStore } from '../../store/sequence-store'
import { PairwiseAlignmentViewer } from './PairwiseAlignmentViewer'

export function DistanceMatrixHeatmap() {
  const { distanceMatrix, setSelectedPair } = useAlignmentStore()
  const { steps, currentStep } = useTreeStore()
  const { showHeatmap, theme } = useUIStore()
  const { sequences } = useSequenceStore()
  const labels = sequences.map(s => s.label)

  if (!showHeatmap || distanceMatrix.length === 0) return null

  const displayMatrix = steps[currentStep]?.matrixSnapshot || distanceMatrix
  const isFullMatrix = displayMatrix.length === distanceMatrix.length
  const displayLabels = labels.length === displayMatrix.length ? labels : displayMatrix.map((_: any, i: number) => `S${i + 1}`)
  const maxVal = Math.max(1, ...displayMatrix.flat())

  const isDark = theme === 'dark'

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Distance Matrix</label>
      <div className="overflow-x-auto border border-border">
        <table className="text-[9px] font-mono border-collapse w-full">
          <thead>
            <tr>
              <th className="p-1 bg-surface-hover" />
              {displayLabels.map((l: string, i: number) => (
                <th key={i} className="p-1 font-medium text-text-muted max-w-10 truncate" title={l}>
                  {l.length > 5 ? l.slice(0, 4) + '..' : l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMatrix.map((row: number[], i: number) => (
              <tr key={i}>
                <td className="p-1 font-medium text-text-muted bg-surface-hover max-w-10 truncate text-right" title={displayLabels[i]}>
                  {displayLabels[i].length > 5 ? displayLabels[i].slice(0, 4) + '..' : displayLabels[i]}
                </td>
                {row.map((val: number, j: number) => {
                  const intensity = maxVal > 0 ? val / maxVal : 0
                  const cellColor = isDark
                    ? `rgba(190, 18, 72, ${intensity * 0.5 + 0.08})`
                    : `rgba(253, 164, 175, ${intensity * 0.7 + 0.08})`
                  const textColor = isDark
                    ? intensity > 0.5 ? '#fda4af' : '#a9b1d6'
                    : intensity > 0.6 ? '#9f1239' : '#495057'
                  const isClickable = j > i && isFullMatrix
                  return (
                    <td
                      key={j}
                      className={`p-0.5 text-center min-w-[1.5rem] ${isClickable ? 'cursor-pointer' : ''}`}
                      style={{
                        backgroundColor: cellColor,
                        color: textColor,
                      }}
                      onClick={isClickable ? () => setSelectedPair({ i: Math.min(i, j), j: Math.max(i, j) }) : undefined}
                      title={isClickable ? `Click to view alignment` : undefined}
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
      <PairwiseAlignmentViewer />
    </div>
  )
}
