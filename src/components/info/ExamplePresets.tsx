import { useSequenceStore } from '../../store/sequence-store'
import { PRESETS, generateRandomPreset } from '../../lib/utils/presets'

export function ExamplePresets() {
  const { setRawInput } = useSequenceStore()

  const loadPreset = (fasta: string) => {
    setRawInput(fasta)
  }

  const handleRandom = () => {
    const count = 4 + Math.floor(Math.random() * 4)
    const fasta = generateRandomPreset(count, 30 + Math.floor(Math.random() * 40))
    setRawInput(fasta)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium">Example Presets</label>
      <div className="grid grid-cols-2 gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset.fasta)}
            className="text-[10px] px-2 py-1.5 rounded border text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"
            title={preset.description}
          >
            <span className="font-medium">{preset.name}</span>
            <br />
            <span className="text-gray-400">{preset.description}</span>
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="text-[10px] px-2 py-1.5 rounded border text-left hover:bg-amber-50 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium">🎲 Random</span>
          <br />
          <span className="text-gray-400">Generate random sequences</span>
        </button>
      </div>
    </div>
  )
}
