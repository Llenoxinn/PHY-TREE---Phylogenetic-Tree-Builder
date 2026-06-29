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
    <div className="absolute inset-0 flex items-center justify-center bg-surface-alt overflow-y-auto">
      <div className="max-w-2xl w-full px-8 py-12">
        <div className="text-center mb-8">
          <div className="mb-3">
            <PhyTreeLogo size={48} />
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-1 tracking-tight">
            Phylogenetic Tree Builder
          </h1>
          <p className="text-text-secondary text-xs max-w-md mx-auto leading-relaxed">
            Input DNA sequences, compute pairwise distances via Needleman-Wunsch alignment,
            and render an interactive evolutionary tree. Step through the algorithm to see how it works.
          </p>
        </div>

        <div className="border border-border bg-surface p-4 mb-4">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">How it works</h2>
          <div className="grid grid-cols-4 gap-3">
            {STEPS.map(step => (
              <div key={step.num} className="space-y-1">
                <span className="text-[10px] font-mono text-blush-500 dark:text-blush-400">{step.num}</span>
                <h3 className="text-xs font-medium text-text-primary leading-tight">{step.title}</h3>
                <p className="text-[10px] text-text-muted leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border bg-surface p-4">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">Try an example</h2>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset.fasta)}
                className="text-left px-3 py-2 border border-border hover:border-blush-300 dark:hover:border-blush-700 hover:bg-blush-50/50 dark:hover:bg-blush-900/10 transition-colors group"
              >
                <span className="text-xs font-medium text-text-primary group-hover:text-blush-600 dark:group-hover:text-blush-400">{preset.name}</span>
                <p className="text-[10px] text-text-muted">{preset.description}</p>
              </button>
            ))}
          </div>
          <button
            onClick={handleRandom}
            className="w-full px-3 py-2 border border-dashed border-border text-text-muted hover:text-blush-600 dark:hover:text-blush-400 hover:border-blush-300 dark:hover:border-blush-700 hover:bg-blush-50/50 dark:hover:bg-blush-900/10 text-xs transition-colors"
          >
            Generate random sequences
          </button>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  { num: '01', title: 'Input', desc: 'Paste FASTA sequences or one per line' },
  { num: '02', title: 'Configure', desc: 'Pick scoring matrix and gap penalty' },
  { num: '03', title: 'Build', desc: 'Compute pairwise distances and render tree' },
  { num: '04', title: 'Explore', desc: 'Step through algorithm, inspect nodes' },
]
