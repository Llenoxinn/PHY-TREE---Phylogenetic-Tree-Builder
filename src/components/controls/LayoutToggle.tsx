import { useTreeStore } from '../../store/tree-store'
import type { LayoutType } from '../../types'

export function LayoutToggle() {
  const { layoutType, setLayoutType } = useTreeStore()

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Tree Layout</label>
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg">
        {(['rectangular', 'circular'] as LayoutType[]).map((t) => (
          <button
            key={t}
            onClick={() => setLayoutType(t)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              layoutType === t ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'rectangular' ? 'Rectangular' : 'Circular'}
          </button>
        ))}
      </div>
    </div>
  )
}
