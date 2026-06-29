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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const state = useTreeStore.getState()
      if (state.steps.length === 0) return
      if (e.code === 'Space') { e.preventDefault(); state.isPlaying ? state.pause() : state.play() }
      if (e.code === 'ArrowRight') state.nextStep()
      if (e.code === 'ArrowLeft') state.prevStep()
      if (e.code === 'Home') state.goToStep(0)
      if (e.code === 'End') state.goToStep(state.steps.length - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (steps.length === 0) return null

  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-blush-600">Step {currentStep} / {steps.length - 1}</span>
        <span className="text-[10px] text-gray-400 max-w-xs truncate">{steps[currentStep]?.description}</span>
      </div>

      <div className="relative h-2 bg-blush-100 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-blush-400 to-blush-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <button onClick={() => goToStep(0)} className="p-2 rounded-lg hover:bg-blush-50 text-gray-500 hover:text-blush-600 transition-colors" title="First step">⏮</button>
        <button onClick={prevStep} className="p-2 rounded-lg hover:bg-blush-50 text-gray-500 hover:text-blush-600 transition-colors" title="Previous step">◀</button>
        <button
          onClick={() => isPlaying ? pause() : play()}
          className="px-5 py-2 rounded-xl bg-blush-500 text-white text-xs font-bold hover:bg-blush-600 shadow-sm shadow-blush-200 hover:shadow-md transition-all active:scale-95"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={nextStep} className="p-2 rounded-lg hover:bg-blush-50 text-gray-500 hover:text-blush-600 transition-colors" title="Next step">▶</button>
        <button onClick={() => goToStep(steps.length - 1)} className="p-2 rounded-lg hover:bg-blush-50 text-gray-500 hover:text-blush-600 transition-colors" title="Last step">⏩</button>
        <select
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          className="ml-2 text-[10px] border border-blush-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blush-300"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1x</option>
          <option value={500}>2x</option>
          <option value={200}>5x</option>
        </select>
      </div>
    </div>
  )
}
