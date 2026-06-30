import type { ScoringMatrix, TreeNode } from '../../types'

function normalizeSeq(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, '')
}

function profileScore(colA: string[], colB: string[], matrix: ScoringMatrix, gapPenalty: number): number {
  let score = 0
  for (const a of colA) {
    for (const b of colB) {
      if (a === '-' || b === '-') {
        score += gapPenalty
      } else {
        score += matrix[a]?.[b] ?? gapPenalty
      }
    }
  }
  return score
}

function alignProfiles(alignA: string[], alignB: string[], matrix: ScoringMatrix, gapPenalty: number): string[] {
  const numA = alignA.length
  const numB = alignB.length
  const lenA = alignA[0].length
  const lenB = alignB[0].length

  const dp: number[][] = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(-Infinity))
  dp[0][0] = 0
  for (let i = 1; i <= lenA; i++) dp[i][0] = dp[i - 1][0] + gapPenalty * numA
  for (let j = 1; j <= lenB; j++) dp[0][j] = dp[0][j - 1] + gapPenalty * numB

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const colA = alignA.map(s => s[i - 1])
      const colB = alignB.map(s => s[j - 1])
      const match = dp[i - 1][j - 1] + profileScore(colA, colB, matrix, gapPenalty)
      const del = dp[i - 1][j] + gapPenalty * numA
      const ins = dp[i][j - 1] + gapPenalty * numB
      dp[i][j] = Math.max(match, del, ins)
    }
  }

  let i = lenA, j = lenB
  const resultA: string[] = alignA.map(() => '')
  const resultB: string[] = alignB.map(() => '')

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const colA = alignA.map(s => s[i - 1])
      const colB = alignB.map(s => s[j - 1])
      if (dp[i][j] === dp[i - 1][j - 1] + profileScore(colA, colB, matrix, gapPenalty)) {
        for (let k = 0; k < numA; k++) resultA[k] = alignA[k][i - 1] + resultA[k]
        for (let k = 0; k < numB; k++) resultB[k] = alignB[k][j - 1] + resultB[k]
        i--; j--
        continue
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + gapPenalty * numA) {
      for (let k = 0; k < numA; k++) resultA[k] = alignA[k][i - 1] + resultA[k]
      for (let k = 0; k < numB; k++) resultB[k] = '-' + resultB[k]
      i--
    } else {
      for (let k = 0; k < numA; k++) resultA[k] = '-' + resultA[k]
      for (let k = 0; k < numB; k++) resultB[k] = alignB[k][j - 1] + resultB[k]
      j--
    }
  }

  return [...resultA, ...resultB]
}

function gatherLeaves(node: TreeNode): number[] {
  if (!node.children || node.children.length === 0) {
    return node.originalIndex !== undefined ? [node.originalIndex] : []
  }
  return node.children.flatMap(gatherLeaves)
}

function buildProgressiveAlignment(
  node: TreeNode,
  rawSequences: string[],
  matrix: ScoringMatrix,
  gapPenalty: number,
): string[] | null {
  if (!node.children || node.children.length === 0) {
    if (node.originalIndex !== undefined) {
      return [normalizeSeq(rawSequences[node.originalIndex])]
    }
    return null
  }

  const leftAlign = node.children[0] ? buildProgressiveAlignment(node.children[0], rawSequences, matrix, gapPenalty) : null
  const rightAlign = node.children[1] ? buildProgressiveAlignment(node.children[1], rawSequences, matrix, gapPenalty) : null

  if (!leftAlign || !rightAlign) return leftAlign || rightAlign

  return alignProfiles(leftAlign, rightAlign, matrix, gapPenalty)
}

export function computeMSA(
  tree: TreeNode,
  rawSequences: string[],
  matrix: ScoringMatrix,
  gapPenalty: number,
): { aligned: string[]; labels: number[] } | null {
  const result = buildProgressiveAlignment(tree, rawSequences, matrix, gapPenalty)
  if (!result) return null

  const leaves = gatherLeaves(tree)
  const leafOrder = leaves.length === result.length ? leaves : result.map((_, i) => i)

  return { aligned: result, labels: leafOrder }
}

export function computeConservation(aligned: string[]): number[] {
  if (aligned.length === 0) return []
  const cols = aligned[0].length
  const conservation: number[] = []
  for (let c = 0; c < cols; c++) {
    const chars = aligned.map(s => s[c]).filter(ch => ch !== '-')
    if (chars.length === 0) {
      conservation.push(0)
      continue
    }
    const unique = new Set(chars)
    conservation.push(1 - (unique.size - 1) / chars.length)
  }
  return conservation
}

export function computeConsensus(aligned: string[]): string {
  if (aligned.length === 0) return ''
  const cols = aligned[0].length
  let consensus = ''
  for (let c = 0; c < cols; c++) {
    const freq: Record<string, number> = {}
    let maxCount = 0
    let maxChar = '-'
    for (const s of aligned) {
      const ch = s[c]
      if (ch === '-') continue
      freq[ch] = (freq[ch] || 0) + 1
      if (freq[ch] > maxCount) {
        maxCount = freq[ch]
        maxChar = ch
      }
    }
    consensus += maxChar
  }
  return consensus
}
