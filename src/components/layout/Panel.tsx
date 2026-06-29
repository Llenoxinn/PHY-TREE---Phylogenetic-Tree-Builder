import type React from 'react'

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-3 space-y-4 overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}
