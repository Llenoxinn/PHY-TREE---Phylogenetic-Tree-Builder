import { create } from 'zustand'
import type { PairwiseAlignment, ScoringMatrixType } from '../types'
import { SCORING_MATRICES } from '../lib/algorithms/scoring-matrices'
import { computeDistanceMatrix, buildNxNMatrix } from '../lib/algorithms/needleman-wunsch'

interface AlignmentStore {
  pairwiseAlignments: PairwiseAlignment[]
  distanceMatrix: number[][]
  matrixType: ScoringMatrixType
  gapPenalty: number
  isComputing: boolean
  setMatrixType: (t: ScoringMatrixType) => void
  setGapPenalty: (gp: number) => void
  compute: (sequences: string[]) => void
}

export const useAlignmentStore = create<AlignmentStore>((set) => ({
  pairwiseAlignments: [],
  distanceMatrix: [],
  matrixType: 'simple',
  gapPenalty: -2,
  isComputing: false,
  setMatrixType: (t: ScoringMatrixType) => set({ matrixType: t }),
  setGapPenalty: (gp: number) => set({ gapPenalty: gp }),
  compute: (sequences: string[]) => {
    set({ isComputing: true })
    const state = useAlignmentStore.getState()
    const scoring = SCORING_MATRICES[state.matrixType]
    const pairwise = computeDistanceMatrix(sequences, scoring.matrix, state.gapPenalty)
    const matrix = buildNxNMatrix(sequences, pairwise)
    set({ pairwiseAlignments: pairwise, distanceMatrix: matrix, isComputing: false })
  },
}))
