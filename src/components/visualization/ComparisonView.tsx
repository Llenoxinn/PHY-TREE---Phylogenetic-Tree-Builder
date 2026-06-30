import { useTreeStore } from '../../store/tree-store'
import { TreeCanvas } from './TreeCanvas'

export function ComparisonView() {
  const { upgmaSteps, njSteps } = useTreeStore()
  const hasBoth = upgmaSteps.length > 0 && njSteps.length > 0

  if (!hasBoth) return null

  return (
    <div className="flex-1 flex divide-x divide-border overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 relative" id="tree-svg-container-upgma">
          <TreeCanvas stepsOverride={upgmaSteps} methodLabel="UPGMA" />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 relative" id="tree-svg-container-nj">
          <TreeCanvas stepsOverride={njSteps} methodLabel="Neighbor-Joining" />
        </div>
      </div>
    </div>
  )
}
