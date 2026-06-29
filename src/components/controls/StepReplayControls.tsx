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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-muted" style={{ fontFamily: 'var(--font-sans)' }}>
          Step {currentStep}/{steps.length - 1}
        </span>
        <span className="text-[10px] text-text-muted max-w-xs truncate" style={{ fontFamily: 'var(--font-sans)' }}>
          {steps[currentStep]?.description}
        </span>
      </div>

      <div className="relative h-1 bg-border rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-blush-500 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-1">
        <button onClick={() => goToStep(0)} className="p-1 text-text-muted hover:text-text-primary transition-colors text-xs" title="First step">
          |&lt;
        </button>
        <button onClick={prevStep} className="p-1 text-text-muted hover:text-text-primary transition-colors text-xs" title="Previous step">
          &lt;
        </button>
        <button
          onClick={() => isPlaying ? pause() : play()}
          className="px-3 py-1 bg-blush-500 text-white text-[10px] font-medium hover:bg-blush-600 transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextStep} className="p-1 text-text-muted hover:text-text-primary transition-colors text-xs" title="Next step">
          &gt;
        </button>
        <button onClick={() => goToStep(steps.length - 1)} className="p-1 text-text-muted hover:text-text-primary transition-colors text-xs" title="Last step">
          &gt;|
        </button>
        <div className="relative ml-1">
          <select
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            className="text-[10px] border border-border px-2 py-1 bg-surface text-text-primary focus:outline-none appearance-none cursor-pointer pr-5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={200}>5x</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
            <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
