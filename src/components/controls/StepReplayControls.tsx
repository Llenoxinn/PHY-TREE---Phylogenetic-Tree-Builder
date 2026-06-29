import { useEffect, useRef } from 'react'
import { useTreeStore } from '../../store/tree-store'

export function StepReplayControls() {
  const {
    steps, currentStep, isPlaying, playSpeed,
    goToStep, play, pause, nextStep, prevStep, setPlaySpeed,
  } = useTreeStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const state = useTreeStore.getState()
        if (state.currentStep >= state.steps.length - 1) {
          state.pause()
        } else {
          state.nextStep()
        }
      }, playSpeed)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, playSpeed])

  if (steps.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Step {currentStep} / {steps.length - 1}</span>
        <span className="text-[10px] text-gray-400">{steps[currentStep]?.description}</span>
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => goToStep(0)} className="p-1.5 rounded hover:bg-gray-100" title="First step">⏮</button>
        <button onClick={prevStep} className="p-1.5 rounded hover:bg-gray-100" title="Previous step">⏪</button>
        <button
          onClick={() => isPlaying ? pause() : play()}
          className="px-3 py-1.5 rounded bg-blue-500 text-white text-xs font-medium hover:bg-blue-600"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={nextStep} className="p-1.5 rounded hover:bg-gray-100" title="Next step">⏭</button>
        <button onClick={() => goToStep(steps.length - 1)} className="p-1.5 rounded hover:bg-gray-100" title="Last step">⏩</button>
        <select
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          className="ml-2 text-xs border rounded px-1 py-0.5"
        >
          <option value={2000}>2s</option>
          <option value={1000}>1s</option>
          <option value={500}>0.5s</option>
          <option value={200}>0.2s</option>
        </select>
      </div>
    </div>
  )
}
