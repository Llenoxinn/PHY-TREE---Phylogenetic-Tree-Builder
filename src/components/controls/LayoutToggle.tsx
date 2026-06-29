import { useTreeStore } from '../../store/tree-store'
import type { LayoutType } from '../../types'

export function LayoutToggle() {
  const { layoutType, setLayoutType } = useTreeStore()

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-blush-600">Tree Layout</label>
      <div className="flex gap-1 p-1 bg-blush-50 rounded-xl">
        {(['rectangular', 'circular'] as LayoutType[]).map((t) => (
          <button
            key={t}
            onClick={() => setLayoutType(t)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              layoutType === t ? 'bg-white shadow-sm text-blush-600 shadow-blush-100' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'rectangular' ? '◻ Rectangular' : '◎ Circular'}
          </button>
        ))}
      </div>
    </div>
  )
}
