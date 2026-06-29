import { useSequenceStore } from '../../store/sequence-store'
import { PRESETS, generateRandomPreset } from '../../lib/utils/presets'
import { runFullPipeline } from '../../App'

export function ExamplePresets() {
  const { setRawInput } = useSequenceStore()

  const loadPreset = (fasta: string) => {
    setRawInput(fasta)
    setTimeout(() => runFullPipeline(), 50)
  }

  const handleRandom = () => {
    const count = 4 + Math.floor(Math.random() * 4)
    const fasta = generateRandomPreset(count, 30 + Math.floor(Math.random() * 40))
    setRawInput(fasta)
    setTimeout(() => runFullPipeline(), 50)
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Presets</label>
      <div className="space-y-1">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset.fasta)}
            className="w-full text-left px-2.5 py-2 border border-border hover:border-blush-300 dark:hover:border-blush-800 hover:bg-blush-50/30 dark:hover:bg-blush-900/10 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-text-primary group-hover:text-blush-600 dark:group-hover:text-blush-400 block">{preset.name}</span>
                <p className="text-[10px] text-text-muted truncate">{preset.description}</p>
              </div>
              <svg className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="w-full text-left px-2.5 py-2 border border-dashed border-border text-text-muted hover:text-blush-600 dark:hover:text-blush-400 hover:border-blush-300 dark:hover:border-blush-800 hover:bg-blush-50/30 dark:hover:bg-blush-900/10 transition-all text-[11px] font-medium"
        >
          + Generate random sequences
        </button>
      </div>
    </div>
  )
}
