import { useSequenceStore } from '../../store/sequence-store'
import { PRESETS, generateRandomPreset } from '../../lib/utils/presets'
import { runFullPipeline } from '../../App'

const PRESET_ICONS: Record<string, string> = {
  'Great Apes': '\u{1F992}',
  'Mammals': '\u{1F43F}',
  'Primates': '\u{1F9D0}',
  'Plants': '\u{1F33F}',
  'Fish': '\u{1F41F}',
  'Birds': '\u{1F985}',
}

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
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset.fasta)}
            className="w-full text-left px-2.5 py-2 border border-border hover:border-blush-300 dark:hover:border-blush-800 hover:bg-blush-50/30 dark:hover:bg-blush-900/10 transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{PRESET_ICONS[preset.name] || '\u{1F9EC}'}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-text-primary group-hover:text-blush-600 dark:group-hover:text-blush-400 block">{preset.name}</span>
                <p className="text-[10px] text-text-muted truncate">{preset.description}</p>
              </div>
              <svg className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="w-full text-left px-2.5 py-2 border border-dashed border-border text-text-muted hover:text-blush-600 dark:hover:text-blush-400 hover:border-blush-300 dark:hover:border-blush-800 hover:bg-blush-50/30 dark:hover:bg-blush-900/10 transition-all text-[11px] font-medium flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generate random
        </button>
      </div>
    </div>
  )
}
