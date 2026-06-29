import { useSequenceStore } from '../../store/sequence-store'
import { PRESETS, generateRandomPreset } from '../../lib/utils/presets'
import { runFullPipeline } from '../../App'

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
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white via-blush-50 to-blush-100 overflow-y-auto">
      <div className="max-w-3xl w-full px-6 py-10 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blush-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blush-200">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Build Phylogenetic Trees<br />
            <span className="text-blush-500">from DNA Sequences</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Input a few DNA sequences, compute pairwise similarities with Needleman-Wunsch alignment,
            and render an interactive evolutionary tree. Step through the algorithm to see how it works.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-10">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-white rounded-xl p-3 border border-blush-100 shadow-sm">
              <div className="w-6 h-6 bg-blush-500 text-white rounded-full flex items-center justify-center text-xs font-bold mb-2">
                {step.num}
              </div>
              <h3 className="text-xs font-semibold text-gray-800 mb-1">{step.title}</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Try an Example</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset.fasta)}
                className="text-left px-4 py-3 rounded-xl border border-blush-100 hover:border-blush-300 hover:bg-blush-50 transition-all group"
              >
                <span className="text-sm font-semibold text-gray-800 group-hover:text-blush-600">{preset.name}</span>
                <p className="text-[10px] text-gray-400 mt-0.5">{preset.description}</p>
              </button>
            ))}
          </div>
          <button
            onClick={handleRandom}
            className="w-full px-4 py-3 rounded-xl border border-dashed border-blush-200 text-blush-500 hover:bg-blush-50 hover:border-blush-300 text-sm font-medium transition-all"
          >
            Generate Random Sequences
          </button>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  { num: '1', title: 'Input Sequences', desc: 'Paste DNA sequences in FASTA format, or one per line. Each sequence gets a label you can edit.' },
  { num: '2', title: 'Choose Method', desc: 'Pick UPGMA (simpler, assumes clock-like evolution) or Neighbor-Joining (more accurate for real data).' },
  { num: '3', title: 'Build Tree', desc: 'Click Build & Re-Run. The tree renders instantly with animated branch drawing.' },
  { num: '4', title: 'Replay & Explore', desc: 'Step through the algorithm one merge at a time. Click nodes to inspect. Zoom and pan.' },
]
