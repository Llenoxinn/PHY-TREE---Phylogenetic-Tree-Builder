import { useSequenceStore } from '../../store/sequence-store'
import { PRESETS, generateRandomPreset } from '../../lib/utils/presets'
import { runFullPipeline } from '../../App'
import { PhyTreeLogo } from '../layout/PhyTreeLogo'

export function WelcomeHero() {
  const { setRawInput, sequences } = useSequenceStore()

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

  if (sequences.length > 0) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-alt overflow-y-auto p-4 sm:p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex mb-3">
            <PhyTreeLogo size={48} />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight mb-2">
            Phylogenetic Tree Builder
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Input DNA sequences, compute pairwise distances via Needleman-Wunsch
            alignment, and render an interactive evolutionary tree.
          </p>
        </div>

        {/* Steps */}
        <div className="border border-border bg-surface p-3 sm:p-4 mb-4">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
            How it works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {STEPS.map(step => (
              <div key={step.num} className="flex gap-2 sm:gap-3">
                <span className="text-base sm:text-lg font-light text-blush-400 dark:text-blush-500 leading-none mt-0.5">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-text-primary">{step.title}</h3>
                  <p className="text-[10px] sm:text-xs text-text-muted leading-snug mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="border border-border bg-surface p-3 sm:p-4">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
            Try an example
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mb-3">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset.fasta)}
                className="text-left px-3 py-2.5 border border-border hover:border-blush-300 dark:hover:border-blush-700 hover:bg-blush-50/30 dark:hover:bg-blush-900/10 transition-colors group"
              >
                <span className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-blush-600 dark:group-hover:text-blush-400">
                  {preset.name}
                </span>
                <p className="text-[10px] sm:text-xs text-text-muted mt-0.5">{preset.description}</p>
              </button>
            ))}
          </div>
          <button
            onClick={handleRandom}
            className="w-full px-3 py-2.5 border border-dashed border-border text-text-muted hover:text-blush-600 dark:hover:text-blush-400 hover:border-blush-300 dark:hover:border-blush-700 hover:bg-blush-50/30 dark:hover:bg-blush-900/10 text-xs sm:text-sm transition-colors"
          >
            Generate random sequences
          </button>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  { num: '1', title: 'Input', desc: 'Paste FASTA sequences or one per line' },
  { num: '2', title: 'Configure', desc: 'Pick scoring matrix and gap penalty' },
  { num: '3', title: 'Build', desc: 'Compute pairwise distances and render tree' },
  { num: '4', title: 'Explore', desc: 'Step through algorithm, inspect nodes' },
]
