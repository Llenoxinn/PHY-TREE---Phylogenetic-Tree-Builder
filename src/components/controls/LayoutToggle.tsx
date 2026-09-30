import { useTreeStore } from '../../store/tree-store'
import { useUIStore, type BranchMode } from '../../store/ui-store'
import type { LayoutType } from '../../types'
import { InfoIcon } from '../ui/Tooltip'

export function LayoutToggle() {
  const { layoutType, setLayoutType } = useTreeStore()
  const { treeSettings, setTreeSettings } = useUIStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Layout</label>
        <InfoIcon tip="Visual arrangement of the tree. Rectangular is standard; circular saves space for many taxa" />
      </div>
      <div className="flex border border-border">
        {(['rectangular', 'circular'] as LayoutType[]).map(t => (
          <button
            key={t}
            onClick={() => setLayoutType(t)}
            className={`flex-1 px-2 py-1.5 text-[11px] font-medium capitalize transition-colors ${
              layoutType === t
                ? 'bg-blush-500 text-white'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex border border-border">
        {(['phylogram', 'cladogram'] as BranchMode[]).map(m => (
          <button
            key={m}
            onClick={() => setTreeSettings({ branchMode: m })}
            title={m === 'phylogram' ? 'Branches drawn to scale by evolutionary distance' : 'Branching order only; all leaves aligned'}
            className={`flex-1 px-2 py-1.5 text-[11px] font-medium capitalize transition-colors ${
              treeSettings.branchMode === m
                ? 'bg-blush-500 text-white'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
