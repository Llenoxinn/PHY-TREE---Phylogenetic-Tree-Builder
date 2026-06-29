import { useState } from 'react'
import { useSequenceStore } from '../../store/sequence-store'

const SEQUENCE_COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac']

export function SequenceInput() {
  const { rawInput, setRawInput, sequences, validationErrors } = useSequenceStore()
  const [isEditing, setIsEditing] = useState(false)

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text')
    if (text.trim().startsWith('>')) {
      setRawInput(text)
    }
  }

  const hasSeqs = sequences.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-blush-600">Sequences</label>
        <div className="flex items-center gap-1.5">
          {hasSeqs && (
            <span className="text-[10px] bg-blush-100 text-blush-600 px-2 py-0.5 rounded-full font-medium">
              {sequences.length} loaded
            </span>
          )}
          {hasSeqs && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[10px] text-blush-400 hover:text-blush-600 transition-colors"
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
      </div>

      {isEditing || !hasSeqs ? (
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onPaste={handlePaste}
          placeholder={`>Human\nGAGCTGGTAGACGGTACCT\n\n>Chimp\nGAGCTGGTAGACGGTACCT`}
          rows={8}
          className="w-full p-3 border border-blush-100 rounded-xl resize-y bg-blush-50/30 focus:outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-400 placeholder:text-blush-300 transition-all"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: '1.7', letterSpacing: '0.02em' }}
        />
      ) : (
        <div className="space-y-0 border border-blush-100 rounded-xl bg-blush-50/20 overflow-hidden">
          {sequences.map((seq, i) => {
            const errs = validationErrors[i] || []
            const errPositions = new Set(errs.map(e => e.position))
            const color = SEQUENCE_COLORS[i % SEQUENCE_COLORS.length]
            return (
              <div
                key={seq.id}
                className="px-3 py-2 border-b border-blush-50 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] font-semibold" style={{ color }}>
                    {seq.label}
                  </span>
                  <span className="text-[9px] text-gray-400 ml-auto font-mono">
                    {seq.raw.length} bp
                  </span>
                </div>
                <div
                  className="break-all text-[10px] text-gray-600 leading-relaxed"
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
                >
                  {seq.raw.split('').map((char, pos) => (
                    <span
                      key={pos}
                      className={
                        errPositions.has(pos)
                          ? 'text-red-500 font-bold bg-red-100 rounded px-px'
                          : undefined
                      }
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {validationErrors.some(e => e.length > 0) && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          {validationErrors.flat().length} invalid character(s) found
        </div>
      )}
      {sequences.length > 0 && sequences.length < 2 && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          Need at least 2 sequences to build a tree
        </div>
      )}
    </div>
  )
}
