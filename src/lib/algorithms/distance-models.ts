import type { DistanceCorrection, PairwiseAlignment } from '../../types'

/**
 * Jukes–Cantor (1969) correction for nucleotide p-distance:
 * d = −¾ ln(1 − 4p/3). Returns null when p ≥ 0.75 (saturation: not computable).
 */
export function jukesCantor(p: number): number | null {
  const arg = 1 - (4 / 3) * p
  if (arg <= 0) return null
  return p === 0 ? 0 : -0.75 * Math.log(arg)
}

/**
 * Poisson correction for amino-acid p-distance (Zuckerkandl & Pauling, 1965;
 * Nei & Kumar, 2000): d = −ln(1 − p). Returns null when p ≥ 1.
 */
export function poisson(p: number): number | null {
  const arg = 1 - p
  if (arg <= 0) return null
  return p === 0 ? 0 : -Math.log(arg)
}

export function correctionName(isProtein: boolean): string {
  return isProtein ? 'Poisson' : 'Jukes–Cantor'
}

/**
 * Derives each pair's tree distance from its stored p-distance. No re-alignment
 * is needed, so toggling the correction is instant.
 */
export function applyCorrection(
  pairwise: PairwiseAlignment[],
  correction: DistanceCorrection,
  isProtein: boolean,
): PairwiseAlignment[] {
  return pairwise.map(pair => {
    if (correction === 'none') return { ...pair, distance: pair.pDistance, saturated: false }
    const d = isProtein ? poisson(pair.pDistance) : jukesCantor(pair.pDistance)
    return d === null
      ? { ...pair, distance: Infinity, saturated: true }
      : { ...pair, distance: d, saturated: false }
  })
}
