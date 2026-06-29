import { useRef, useCallback } from 'react'
import { useSequenceStore } from '../../store/sequence-store'
import { sequencesFromText } from '../../lib/io/fasta-parser'

export function SequenceInput() {
  const { rawInput, setRawInput, sequences, validationErrors } = useSequenceStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setRawInput(text)
  }, [setRawInput])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text')
    if (text.trim().startsWith('>')) {
      const seqs = sequencesFromText(text)
      if (seqs.length >= 2) {
        setRawInput(text)
      }
    }
  }, [setRawInput])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Sequences</label>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".fasta,.fa,.txt" className="hidden" onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} className="text-xs px-2 py-1 rounded border hover:bg-gray-100">
            Upload FASTA
          </button>
        </div>
      </div>
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        onPaste={handlePaste}
        placeholder="Paste DNA sequences (FASTA or one per line)&#10;&#62;Human&#10;ACGTGCTAGCTAGC&#10;&#62;Chimp&#10;ACGTGCTAGCTAGC"
        rows={8}
        className="w-full font-mono text-sm p-2 border rounded resize-y"
      />
      {sequences.length > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>{sequences.length} sequences loaded</p>
          {validationErrors.some(e => e.length > 0) && (
            <p className="text-red-500">
              {validationErrors.flat().length} invalid character(s) found
            </p>
          )}
          {sequences.length < 2 && (
            <p className="text-amber-500">Need at least 2 sequences to build a tree</p>
          )}
        </div>
      )}
    </div>
  )
}
