import { useSequenceStore } from '../../store/sequence-store'

export function SequenceLabels() {
  const { sequences, updateLabel, validationErrors } = useSequenceStore()

  if (sequences.length === 0) return null

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Taxon Labels</label>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {sequences.map((seq, i) => (
          <div key={seq.id} className="flex items-center gap-2 text-xs">
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${validationErrors[i]?.length ? 'bg-red-400' : 'bg-green-400'}`} />
            <input
              value={seq.label}
              onChange={(e) => updateLabel(i, e.target.value)}
              className="flex-1 border-b px-1 py-0.5 font-mono text-xs bg-transparent focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-400 w-16 text-right">{seq.raw.length}bp</span>
          </div>
        ))}
      </div>
    </div>
  )
}
