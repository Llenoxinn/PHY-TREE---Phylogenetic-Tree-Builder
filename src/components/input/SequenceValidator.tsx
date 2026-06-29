import { useSequenceStore } from '../../store/sequence-store'

export function SequenceValidator() {
  const { sequences, validationErrors, hoveredIndex } = useSequenceStore()

  if (sequences.length === 0) return null

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-blush-600">Sequence Preview</label>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {sequences.map((seq, i) => {
          const errs = validationErrors[i] || []
          const positions = new Set(errs.map(e => e.position))
          return (
            <div
              key={seq.id}
              className={`p-2.5 rounded-xl border transition-all ${
                hoveredIndex === i
                  ? 'bg-blush-50 border-blush-200 shadow-sm'
                  : 'border-blush-50 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'][i % 8],
                  }}
                />
                <span className="font-semibold text-gray-700 text-[11px]">{seq.label}</span>
                <span className="text-gray-400 text-[9px] ml-auto">{seq.raw.length} bp</span>
              </div>
              <div
                className="break-all leading-relaxed text-[10px]"
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
              >
                {seq.raw.split('').map((char, pos) => (
                  <span
                    key={pos}
                    className={positions.has(pos) ? 'text-red-500 font-bold bg-red-100 rounded px-px' : ''}
                    style={!positions.has(pos) ? { color: '#374151' } : undefined}
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
