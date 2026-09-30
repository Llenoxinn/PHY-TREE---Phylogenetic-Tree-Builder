import { describe, expect, it } from 'vitest'
import type { TreeNode } from '../../types'
import { needlemanWunsch, pDistance, computeDistanceMatrix, buildNxNMatrix } from './needleman-wunsch'
import { computeUPGMA } from './upgma'
import { computeNeighborJoining } from './neighbor-joining'
import { SCORING_MATRICES } from './scoring-matrices'
import { jukesCantor, poisson, applyCorrection } from './distance-models'
import { toNewick } from '../io/newick-exporter'

/*
 * Test strategy: rather than copying worked examples, we generate trees with
 * known branch lengths, derive their distance matrices, and check each method
 * against the guarantees proven in the primary literature:
 *   - NJ recovers any tree exactly from its additive (path-length) matrix
 *     (Saitou & Nei, 1987; Studier & Keppler, 1988; Atteson, 1999).
 *   - UPGMA recovers any tree exactly from its ultrametric matrix
 *     (Sokal & Michener, 1958; Felsenstein, 2004, ch. 11).
 */

// ---------- helpers ----------

/** Deterministic PRNG (mulberry32) so failures are reproducible. */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface GenNode { name: string; length: number; height: number; children: GenNode[] }

/**
 * Random binary tree over n leaves. With `clock`, merges happen at increasing
 * heights so every leaf is equidistant from the root (ultrametric).
 */
function randomTree(n: number, seed: number, clock: boolean): GenNode {
  const rand = rng(seed)
  let pool: GenNode[] = Array.from({ length: n }, (_, i) => ({ name: `t${i}`, length: 0, height: 0, children: [] }))
  let height = 0
  while (pool.length > 1) {
    const a = pool.splice(Math.floor(rand() * pool.length), 1)[0]
    const b = pool.splice(Math.floor(rand() * pool.length), 1)[0]
    if (clock) {
      height = Math.max(height, a.height, b.height) + 0.05 + rand()
      a.length = height - a.height
      b.length = height - b.height
    } else {
      a.length = 0.05 + rand()
      b.length = 0.05 + rand()
    }
    pool.push({ name: '', length: 0, height, children: [a, b] })
  }
  return pool[0]
}

/** Leaf-to-leaf path lengths of a generated tree, in leaf order t0..t(n-1). */
function pathMatrix(root: GenNode, n: number): number[][] {
  const paths = new Map<string, GenNode[]>()
  const walk = (node: GenNode, path: GenNode[]) => {
    const p = [...path, node]
    if (node.children.length === 0) paths.set(node.name, p)
    node.children.forEach(c => walk(c, p))
  }
  walk(root, [])
  const D = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const pa = paths.get(`t${i}`)!, pb = paths.get(`t${j}`)!
      let k = 0
      while (pa[k] === pb[k]) k++
      const len = (p: GenNode[]) => p.slice(k).reduce((s, x) => s + x.length, 0)
      D[i][j] = D[j][i] = len(pa) + len(pb)
    }
  }
  return D
}

/** Sets of leaf names below each internal node (the tree's clusters). */
function clusters<T extends { children: T[] }>(root: T, nameOf: (n: T) => string): Set<string> {
  const out = new Set<string>()
  const walk = (node: T): string[] => {
    if (node.children.length === 0) return [nameOf(node)]
    const names = node.children.flatMap(walk).sort()
    out.add(names.join(','))
    return names
  }
  walk(root)
  return out
}

const finalTree = (steps: { treeState: TreeNode }[]) => steps[steps.length - 1].treeState

/** Sum of branch lengths on the path between two leaves of a built tree. */
function pathLength(root: TreeNode, a: string, b: string): number {
  const pathTo = (n: TreeNode, name: string): TreeNode[] | null => {
    if (n.children.length === 0) return n.name === name ? [n] : null
    for (const c of n.children) {
      const p = pathTo(c, name)
      if (p) return [n, ...p]
    }
    return null
  }
  const pa = pathTo(root, a)!, pb = pathTo(root, b)!
  let k = 0
  while (k < pa.length && k < pb.length && pa[k] === pb[k]) k++
  const sum = (p: TreeNode[]) => p.slice(k).reduce((s, n) => s + n.distance, 0)
  return sum(pa) + sum(pb)
}

function rootToLeaf(root: TreeNode): number[] {
  const out: number[] = []
  const walk = (n: TreeNode, acc: number) => {
    if (n.children.length === 0) out.push(acc + n.distance)
    n.children.forEach(c => walk(c, acc + (n.name === 'root' ? 0 : n.distance)))
  }
  walk(root, 0)
  return out
}

const SEEDS = [1, 2, 3, 5, 8, 13, 21, 34]

// ---------- tests ----------

describe('pairwise distance', () => {
  it('p-distance ignores gap columns and counts mismatches', () => {
    expect(pDistance('ACGT', 'ACGT')).toBe(0)
    expect(pDistance('ACGT', 'ACGA')).toBe(0.25)
    expect(pDistance('AC-T', 'ACGA')).toBeCloseTo(1 / 3)
  })

  it('aligns identical sequences with no gaps', () => {
    const { alignedA, alignedB } = needlemanWunsch('GATTACA', 'GATTACA', SCORING_MATRICES.simple.matrix, -2)
    expect(alignedA).toBe('GATTACA')
    expect(alignedB).toBe('GATTACA')
  })

  it('gives sensible protein distances under BLOSUM62', () => {
    const seqs = ['MKTAYIAKQRQISFVKSHFSRQ', 'MKTAYIAKQRQISFVKSHFSRE', 'GSHMLEDPVDAFQEWLKRHNPV']
    const { matrix, gapPenalty } = SCORING_MATRICES.blosum62
    const D = buildNxNMatrix(seqs, computeDistanceMatrix(seqs, matrix, gapPenalty))
    expect(D[0][1]).toBeGreaterThan(0)
    expect(D[0][1]).toBeLessThan(D[0][2])
    expect(D[0][2]).toBeGreaterThan(0.5)
  })
})

describe('distance corrections', () => {
  it('Jukes–Cantor: d = −¾ ln(1 − 4p/3) (Jukes & Cantor, 1969)', () => {
    expect(jukesCantor(0)).toBe(0)
    expect(jukesCantor(0.3)).toBeCloseTo(-0.75 * Math.log(1 - 0.4), 12)
    expect(jukesCantor(0.75)).toBeNull()
    expect(jukesCantor(0.9)).toBeNull()
  })

  it('Poisson: d = −ln(1 − p) (Zuckerkandl & Pauling, 1965; Nei & Kumar, 2000)', () => {
    expect(poisson(0)).toBe(0)
    expect(poisson(0.5)).toBeCloseTo(Math.log(2), 12)
    expect(poisson(1)).toBeNull()
  })

  it('corrected distances are never below p and grow faster as p grows', () => {
    for (const f of [jukesCantor, poisson]) {
      let prevGap = 0
      for (const p of [0.05, 0.2, 0.4, 0.6, 0.7]) {
        const d = f(p)!
        expect(d).toBeGreaterThanOrEqual(p)
        expect(d - p).toBeGreaterThanOrEqual(prevGap)
        prevGap = d - p
      }
    }
  })

  it('flags saturated pairs instead of producing a distance', () => {
    const pair = { i: 0, j: 1, alignedA: '', alignedB: '', score: 0, pDistance: 0.8, distance: 0.8, saturated: false }
    const [dna] = applyCorrection([pair], 'corrected', false)
    expect(dna.saturated).toBe(true)
    const [protein] = applyCorrection([pair], 'corrected', true)
    expect(protein.saturated).toBe(false)
    expect(protein.distance).toBeCloseTo(-Math.log(0.2))
    const [none] = applyCorrection([dna], 'none', false)
    expect(none).toMatchObject({ distance: 0.8, saturated: false })
  })
})

describe('UPGMA on ultrametric data (Sokal & Michener, 1958)', () => {
  it.each(SEEDS)('recovers clusters and root height exactly (seed %i)', seed => {
    const n = 4 + (seed % 7)
    const truth = randomTree(n, seed, true)
    const labels = Array.from({ length: n }, (_, i) => `t${i}`)
    const tree = finalTree(computeUPGMA(labels, pathMatrix(truth, n)))

    for (const d of rootToLeaf(tree)) expect(d).toBeCloseTo(truth.height, 9)
    expect(clusters(tree.children[0], x => x.name)).toEqual(clusters(truth, x => x.name))
  })
})

describe('Neighbor-Joining on additive data (Saitou & Nei, 1987; Atteson, 1999)', () => {
  it.each(SEEDS)('reproduces every pairwise path length (seed %i)', seed => {
    const n = 4 + (seed % 7)
    const D = pathMatrix(randomTree(n, seed, false), n)
    const labels = Array.from({ length: n }, (_, i) => `t${i}`)
    const tree = finalTree(computeNeighborJoining(labels, D))

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        expect(pathLength(tree, labels[i], labels[j])).toBeCloseTo(D[i][j], 9)
      }
    }
  })

  it('matches the three-taxon closed form (Fitch & Margoliash, 1967)', () => {
    // With three taxa every pair ties on the NJ criterion, so check the star
    // tree's branch to each leaf from the central node, whichever pair joined first.
    const d: Record<string, number> = { ab: 0.3, ac: 0.5, bc: 0.6 }
    const dist = (x: string, y: string) => d[[x, y].sort().join('')]
    const expected = (x: string) => {
      const [y, z] = ['a', 'b', 'c'].filter(t => t !== x)
      return (dist(x, y) + dist(x, z) - dist(y, z)) / 2
    }
    const tree = finalTree(computeNeighborJoining(['a', 'b', 'c'], [[0, 0.3, 0.5], [0.3, 0, 0.6], [0.5, 0.6, 0]]))
    const find = (n: TreeNode): TreeNode | null =>
      n.children.length === 2 && n.children.every(c => c.children.length === 0) ? n : n.children.map(find).find(Boolean) ?? null
    const center = find(tree)!
    const [x, y] = center.children
    const third = ['a', 'b', 'c'].find(t => t !== x.name && t !== y.name)!

    expect(x.distance).toBeCloseTo(expected(x.name))
    expect(y.distance).toBeCloseTo(expected(y.name))
    expect(pathLength(tree, x.name, third) - x.distance).toBeCloseTo(expected(third))
  })
})

describe('Newick export', () => {
  it('writes branch lengths on every non-root node and unwraps the holder root', () => {
    const tree = finalTree(computeUPGMA(['A', 'B', 'C'], [[0, 2, 6], [2, 0, 6], [6, 6, 0]]))
    expect(toNewick(tree)).toBe('(C:3.000000,(A:1.000000,B:1.000000):2.000000);')
  })
})
