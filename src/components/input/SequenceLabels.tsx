import { useSequenceStore } from '../../store/sequence-store'

export function SequenceLabels() {
  const { sequences, updateLabel, validationErrors, hoveredIndex } = useSequenceStore()

  if (sequences.length === 0) return null

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-blush-600">Taxon Labels</label>
      <div className="space-y-1 max-h-36 overflow-y-auto">
        {sequences.map((seq, i) => (
          <div key={seq.id} className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 transition-colors ${hoveredIndex === i ? 'bg-blush-50 ring-1 ring-blush-200' : 'hover:bg-gray-50'}`}>
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${validationErrors[i]?.length ? 'bg-red-400' : 'bg-blush-400'}`} />
            <input
              value={seq.label}
              onChange={(e) => updateLabel(i, e.target.value)}
              className="flex-1 border-b border-blush-100 px-1 py-0.5 font-mono text-xs bg-transparent focus:outline-none focus:border-blush-400 transition-colors"
            />
            <span className="text-gray-400 w-14 text-right text-[10px]">{seq.raw.length}bp</span>
          </div>
        ))}
      </div>
    </div>
  )
}
