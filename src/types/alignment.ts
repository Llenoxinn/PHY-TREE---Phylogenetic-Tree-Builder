export type ScoringMatrixType = 'simple' | 'blosum62' | 'pam250'

export type DistanceCorrection = 'none' | 'corrected'

export type ScoringMatrix = Record<string, Record<string, number>>

export interface PairwiseAlignment {
  i: number
  j: number
  alignedA: string
  alignedB: string
  score: number
  /** Uncorrected proportion of differing sites. */
  pDistance: number
  /** Distance used to build trees (p-distance, or its corrected value). */
  distance: number
  /** True when the correction is not computable for this pair. */
  saturated: boolean
}
