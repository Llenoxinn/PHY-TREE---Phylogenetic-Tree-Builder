import { useSequenceStore } from '../../store/sequence-store'

export function SequenceLabels() {
  const { sequences, updateLabel, validationErrors, hoveredIndex } = useSequenceStore()

  if (sequences.length === 0) return null

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Labels</label>
      <div className="space-y-0.5 max-h-32 overflow-y-auto">
        {sequences.map((seq, i) => (
          <div key={seq.id} className={`flex items-center gap-1.5 text-[11px] px-1.5 py-1 transition-colors ${hoveredIndex === i ? 'bg-blush-50/50 dark:bg-blush-900/10' : 'hover:bg-surface-hover'}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${validationErrors[i]?.length ? 'bg-red-400' : 'bg-blush-400'}`} />
            <input
              value={seq.label}
              onChange={(e) => updateLabel(i, e.target.value)}
              className="flex-1 border-b border-transparent px-0.5 py-0 font-mono text-[11px] bg-transparent focus:outline-none focus:border-blush-400 transition-colors text-text-primary"
            />
            <span className="text-text-muted font-mono text-[9px] w-10 text-right">{seq.raw.length}bp</span>
          </div>
        ))}
      </div>
    </div>
  )
}
