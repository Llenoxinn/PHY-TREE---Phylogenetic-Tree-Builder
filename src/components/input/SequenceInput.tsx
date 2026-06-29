import { useSequenceStore } from '../../store/sequence-store'

export function SequenceInput() {
  const { rawInput, setRawInput, sequences, validationErrors } = useSequenceStore()

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text')
    if (text.trim().startsWith('>')) {
      setRawInput(text)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-blush-600">Sequences</label>
        {sequences.length > 0 && (
          <span className="text-[10px] bg-blush-100 text-blush-600 px-2 py-0.5 rounded-full font-medium">
            {sequences.length} loaded
          </span>
        )}
      </div>
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        onPaste={handlePaste}
        placeholder={`>Human\nACGTGCTAGCTAGC\n>Chimp\nACGTGCTAGCTAGC`}
        rows={7}
        className="w-full font-mono text-xs p-3 border border-blush-100 rounded-xl resize-y bg-blush-50/30 focus:outline-none focus:ring-2 focus:ring-blush-300 focus:border-blush-400 placeholder:text-blush-300 transition-all"
      />
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
