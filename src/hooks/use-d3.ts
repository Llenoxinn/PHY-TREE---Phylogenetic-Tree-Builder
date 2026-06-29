import { useEffect, useRef } from 'react'

export function useD3(renderFn: (svg: SVGSVGElement) => (() => void) | void, deps: unknown[]) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const cleanup = renderFn(ref.current)
    return () => { cleanup?.() }
  }, deps)

  return ref
}
