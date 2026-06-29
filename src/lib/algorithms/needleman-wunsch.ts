import type { ScoringMatrix, PairwiseAlignment } from '../../types'

function normalizeSeq(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, '')
}

export function needlemanWunsch(
  a: string,
  b: string,
  matrix: ScoringMatrix,
  gapPenalty: number,
): { alignedA: string; alignedB: string; score: number } {
  const seqA = normalizeSeq(a)
  const seqB = normalizeSeq(b)
  const n = seqA.length
  const m = seqB.length

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) dp[i][0] = dp[i - 1][0] + gapPenalty
  for (let j = 1; j <= m; j++) dp[0][j] = dp[0][j - 1] + gapPenalty

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const match = dp[i - 1][j - 1] + (matrix[seqA[i - 1]]?.[seqB[j - 1]] ?? gapPenalty)
      const del = dp[i - 1][j] + gapPenalty
      const ins = dp[i][j - 1] + gapPenalty
      dp[i][j] = Math.max(match, del, ins)
    }
  }

  let i = n, j = m
  let alignedA = '', alignedB = ''
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (matrix[seqA[i - 1]]?.[seqB[j - 1]] ?? gapPenalty)) {
      alignedA = seqA[i - 1] + alignedA
      alignedB = seqB[j - 1] + alignedB
      i--; j--
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + gapPenalty) {
      alignedA = seqA[i - 1] + alignedA
      alignedB = '-' + alignedB
      i--
    } else {
      alignedA = '-' + alignedA
      alignedB = seqB[j - 1] + alignedB
      j--
    }
  }

  return { alignedA, alignedB, score: dp[n][m] }
}

export function computeDistanceMatrix(
  sequences: string[],
  matrix: ScoringMatrix,
  gapPenalty: number,
): PairwiseAlignment[] {
  const n = sequences.length
  const results: PairwiseAlignment[] = []

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const { alignedA, alignedB, score } = needlemanWunsch(sequences[i], sequences[j], matrix, gapPenalty)
      const maxLen = Math.max(sequences[i].length, sequences[j].length)
      const maxScore = maxLen * 2
      const distance = maxScore > 0 ? 1 - ((score + Math.abs(gapPenalty) * Math.abs(sequences[i].length - sequences[j].length)) / maxScore) : 0
      const clamped = Math.max(0, Math.min(1, distance))
      results.push({ i, j, alignedA, alignedB, score, distance: clamped })
    }
  }

  return results
}

export function buildNxNMatrix(sequences: string[], pairwise: PairwiseAlignment[]): number[][] {
  const n = sequences.length
  const mat: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  for (const p of pairwise) {
    mat[p.i][p.j] = p.distance
    mat[p.j][p.i] = p.distance
  }
  return mat
}
