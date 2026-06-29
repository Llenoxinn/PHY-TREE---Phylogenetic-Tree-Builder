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
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Presets</label>
      <div className="space-y-0.5 max-h-56 overflow-y-auto">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset.fasta)}
            className="w-full text-left px-2 py-1.5 hover:bg-surface-hover transition-colors group"
          >
            <span className="text-[11px] font-medium text-text-primary group-hover:text-blush-600 dark:group-hover:text-blush-400">{preset.name}</span>
            <p className="text-[10px] text-text-muted">{preset.description}</p>
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="w-full text-left px-2 py-1.5 text-text-muted hover:text-blush-600 dark:hover:text-blush-400 hover:bg-surface-hover transition-colors text-[11px] font-medium"
        >
          + Random sequences
        </button>
      </div>
    </div>
  )
}
