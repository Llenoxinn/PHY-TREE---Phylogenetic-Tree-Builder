import { useState, useRef, useEffect } from 'react'

export function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition(rect.top < 60 ? 'bottom' : 'top')
    }
  }, [show])

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-50 left-0 px-2.5 py-1.5 bg-text-primary text-surface text-[10px] leading-relaxed max-w-[200px] border border-border shadow-lg pointer-events-none ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export function InfoIcon({ tip }: { tip: string }) {
  return (
    <Tooltip content={tip}>
      <svg className="w-3 h-3 text-text-muted hover:text-text-secondary cursor-help transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </Tooltip>
  )
}
