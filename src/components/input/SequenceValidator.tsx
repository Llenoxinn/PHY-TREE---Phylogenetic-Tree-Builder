import { useSequenceStore } from '../../store/sequence-store'

export function SequenceValidator() {
  const { sequences, validationErrors, hoveredIndex } = useSequenceStore()

  if (sequences.length === 0) return null

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-blush-600">Sequence Preview</label>
      <div className="space-y-1 max-h-40 overflow-y-auto text-xs font-mono">
        {sequences.map((seq, i) => {
          const errs = validationErrors[i] || []
          const positions = new Set(errs.map(e => e.position))
          return (
            <div
              key={seq.id}
              className={`p-2 rounded-lg border transition-colors ${hoveredIndex === i ? 'bg-blush-50 border-blush-200' : 'border-blush-50 hover:bg-gray-50'}`}
            >
              <div className="flex gap-1 mb-1">
                <span className="font-semibold text-blush-600 truncate max-w-28 text-[10px]">{seq.label}</span>
                <span className="text-gray-400 text-[10px]">{seq.raw.length}bp</span>
              </div>
              <div className="tracking-wider break-all leading-relaxed">
                {seq.raw.split('').map((char, pos) => (
                  <span
                    key={pos}
                    className={`${positions.has(pos) ? 'text-red-500 font-bold bg-red-100 rounded' : 'text-gray-700'}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
