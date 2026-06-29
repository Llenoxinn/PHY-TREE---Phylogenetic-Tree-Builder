import { useTreeStore } from '../../store/tree-store'
import type { LayoutType } from '../../types'

export function LayoutToggle() {
  const { layoutType, setLayoutType } = useTreeStore()

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Layout</label>
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
    </div>
  )
}
