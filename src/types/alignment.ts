export type ScoringMatrixType = 'simple' | 'blosum62' | 'pam250'

export type ScoringMatrix = Record<string, Record<string, number>>

export interface PairwiseAlignment {
  i: number
  j: number
  alignedA: string
  alignedB: string
  score: number
  distance: number
}
