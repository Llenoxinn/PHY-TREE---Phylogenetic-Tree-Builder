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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Sequences</label>
        <div className="flex items-center gap-2">
          {hasSeqs && (
            <span className="text-[10px] text-text-muted font-mono">
              {sequences.length} seq{sequences.length > 1 ? 's' : ''}
            </span>
          )}
          {hasSeqs && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[10px] text-text-muted hover:text-blush-500 dark:hover:text-blush-400 transition-colors"
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
          className="w-full p-2 border border-border resize-y bg-surface focus:outline-none focus:border-blush-400 placeholder:text-text-muted text-text-primary"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: '1.6', letterSpacing: '0.02em' }}
        />
      ) : (
        <div className="border border-border bg-surface">
          {sequences.map((seq, i) => {
            const errs = validationErrors[i] || []
            const errPositions = new Set(errs.map(e => e.position))
            const color = SEQUENCE_COLORS[i % SEQUENCE_COLORS.length]
            return (
              <div
                key={seq.id}
                className="px-2 py-1.5 border-b border-border last:border-b-0 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-medium" style={{ color }}>
                    {seq.label}
                  </span>
                  <span className="text-[9px] text-text-muted ml-auto font-mono">
                    {seq.raw.length}bp
                  </span>
                </div>
                <div
                  className="break-all text-[10px] text-text-secondary leading-relaxed font-mono"
                  style={{ letterSpacing: '0.04em' }}
                >
                  {seq.raw.split('').map((char, pos) => (
                    <span
                      key={pos}
                      className={
                        errPositions.has(pos)
                          ? 'text-red-500 font-bold bg-red-100 dark:bg-red-900/30 px-px'
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
        <div className="text-[10px] text-red-500 font-mono">
          {validationErrors.flat().length} invalid character(s) found
        </div>
      )}
      {sequences.length > 0 && sequences.length < 2 && (
        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
          Need at least 2 sequences to build a tree
        </div>
      )}
    </div>
  )
}
