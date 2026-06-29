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
      <label className="text-xs font-semibold text-blush-600">Quick Start</label>
      <div className="space-y-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset.fasta)}
            className="w-full text-left px-3 py-2 rounded-xl border border-blush-100 hover:border-blush-300 hover:bg-blush-50 transition-all group"
          >
            <span className="text-xs font-semibold text-gray-700 group-hover:text-blush-600">{preset.name}</span>
            <p className="text-[10px] text-gray-400">{preset.description}</p>
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="w-full text-left px-3 py-2 rounded-xl border border-dashed border-blush-200 text-blush-500 hover:bg-blush-50 hover:border-blush-300 text-xs font-medium transition-all"
        >
          Generate Random
        </button>
      </div>
    </div>
  )
}
