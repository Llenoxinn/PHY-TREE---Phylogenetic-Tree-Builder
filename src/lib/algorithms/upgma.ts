import type { TreeNode, MergeStep } from '../../types'

interface Cluster {
  size: number
  indices: number[]
}

function buildLeaf(name: string, index: number): TreeNode {
  return { id: `leaf-${index}`, name, distance: 0, children: [] }
}

function cloneMatrix(m: number[][]): number[][] {
  return m.map(r => [...r])
}

export function computeUPGMA(labels: string[], distanceMatrix: number[][]): MergeStep[] {
  const n = labels.length
  const steps: MergeStep[] = []
  let currentLabels = [...labels]
  let clusters: Cluster[] = labels.map((_, i) => ({ size: 1, indices: [i] }))
  let nodes: TreeNode[] = labels.map((l, i) => buildLeaf(l, i))
  let matrix = cloneMatrix(distanceMatrix)

  steps.push({
    stepNumber: 0,
    mergedClusters: [-1, -1],
    mergeDistance: 0,
    clusterContents: clusters.map(c => c.indices),
    matrixSnapshot: cloneMatrix(matrix),
    treeState: JSON.parse(JSON.stringify({
      id: 'root', name: 'root', distance: 0, children: nodes,
    })),
    description: 'Initial: all sequences as separate leaves',
  })

  while (clusters.length > 1) {
    const m = clusters.length
    let minDist = Infinity, minI = -1, minJ = -1

    for (let i = 0; i < m; i++) {
      for (let j = i + 1; j < m; j++) {
        const d = matrix[i][j]
        if (d !== undefined && d < minDist) {
          minDist = d
          minI = i
          minJ = j
        }
      }
    }

    if (minI === -1) break

    const mergedIndices = [...clusters[minI].indices, ...clusters[minJ].indices]
    const labelA = currentLabels[minI]
    const labelB = currentLabels[minJ]
    const mergedLabel = `(${labelA}+${labelB})`
    const newSize = clusters[minI].size + clusters[minJ].size

    const parent: TreeNode = {
      id: `node-${n + steps.length}`,
      name: mergedLabel,
      distance: minDist,
      children: [nodes[minI], nodes[minJ]],
      mergeStep: steps.length,
      mergeDistance: minDist,
    }

    const keepIdx: number[] = []
    for (let k = 0; k < m; k++) {
      if (k !== minI && k !== minJ) keepIdx.push(k)
    }

    const newM = keepIdx.length + 1
    const newMatrix: number[][] = Array.from({ length: newM }, () => new Array(newM).fill(0))

    for (let a = 0; a < keepIdx.length; a++) {
      for (let b = 0; b < keepIdx.length; b++) {
        newMatrix[a][b] = matrix[keepIdx[a]][keepIdx[b]]
      }
    }

    const newIdx = keepIdx.length
    for (let a = 0; a < keepIdx.length; a++) {
      const k = keepIdx[a]
      const d = (clusters[minI].size * matrix[minI][k] + clusters[minJ].size * matrix[minJ][k]) / newSize
      newMatrix[a][newIdx] = d
      newMatrix[newIdx][a] = d
    }

    clusters = [
      ...keepIdx.map(k => clusters[k]),
      { size: newSize, indices: mergedIndices },
    ]
    currentLabels = [
      ...keepIdx.map(k => currentLabels[k]),
      mergedLabel,
    ]
    nodes = [
      ...keepIdx.map(k => nodes[k]),
      parent,
    ]
    matrix = newMatrix

    steps.push({
      stepNumber: steps.length,
      mergedClusters: [minI, minJ],
      mergeDistance: minDist,
      clusterContents: clusters.map(c => c.indices),
      matrixSnapshot: cloneMatrix(matrix),
      treeState: JSON.parse(JSON.stringify({
        id: 'root', name: 'root', distance: 0, children: nodes,
      })),
      description: `Merged ${labelA} + ${labelB} at distance ${minDist.toFixed(4)}`,
    })
  }

  return steps
}
