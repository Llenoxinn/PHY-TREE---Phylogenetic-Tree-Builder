import type { TreeNode, MergeStep } from '../../types'

function buildLeaf(name: string, index: number): TreeNode {
  return { id: `leaf-${index}`, name, distance: 0, children: [] }
}

function cloneMatrix(m: number[][]): number[][] {
  return m.map(r => [...r])
}

export function computeNeighborJoining(labels: string[], distanceMatrix: number[][]): MergeStep[] {
  const n = labels.length
  const steps: MergeStep[] = []
  let currentLabels = [...labels]
  let matrix = cloneMatrix(distanceMatrix)
  let nodes: TreeNode[] = labels.map((l, i) => buildLeaf(l, i))

  steps.push({
    stepNumber: 0, mergedClusters: [-1, -1], mergeDistance: 0,
    clusterContents: labels.map((_, i) => [i]),
    matrixSnapshot: cloneMatrix(matrix),
    treeState: JSON.parse(JSON.stringify({
      id: 'root', name: 'root', distance: 0, children: [...nodes],
    })),
    description: 'Initial: all sequences as separate leaves',
  })

  while (nodes.length > 2) {
    const m = nodes.length
    const r: number[] = []
    for (let i = 0; i < m; i++) {
      let sum = 0
      for (let j = 0; j < m; j++) sum += (matrix[i][j] || 0)
      r.push(m > 2 ? sum / (m - 2) : 0)
    }

    let minD = Infinity, minI = -1, minJ = -1
    for (let i = 0; i < m; i++) {
      for (let j = i + 1; j < m; j++) {
        const d = (matrix[i][j] || 0) - r[i] - r[j]
        if (d < minD) { minD = d; minI = i; minJ = j }
      }
    }

    if (minI === -1) break

    const dist = matrix[minI][minJ] || 0
    const labelA = currentLabels[minI]
    const labelB = currentLabels[minJ]
    const parent: TreeNode = {
      id: `node-${n + steps.length - 1}`,
      name: `(${labelA}+${labelB})`,
      distance: dist,
      children: [nodes[minI], nodes[minJ]],
      mergeStep: steps.length,
      mergeDistance: dist,
    }

    const keepIdx: number[] = []
    for (let k = 0; k < m; k++) {
      if (k !== minI && k !== minJ) keepIdx.push(k)
    }

    const newRow: number[] = []
    for (const k of keepIdx) {
      newRow.push(((matrix[minI][k] || 0) + (matrix[minJ][k] || 0) - dist) / 2)
    }

    const newM = keepIdx.length + 1
    const newMatrix: number[][] = Array.from({ length: newM }, () => new Array(newM).fill(0))
    for (let a = 0; a < keepIdx.length; a++) {
      for (let b = 0; b < keepIdx.length; b++) {
        newMatrix[a][b] = matrix[keepIdx[a]][keepIdx[b]] || 0
      }
    }
    const newIdx = keepIdx.length
    for (let a = 0; a < keepIdx.length; a++) {
      newMatrix[a][newIdx] = newRow[a]
      newMatrix[newIdx][a] = newRow[a]
    }

    nodes = [...keepIdx.map(k => nodes[k]), parent]
    currentLabels = [...keepIdx.map(k => currentLabels[k]), `(${labelA}+${labelB})`]
    matrix = newMatrix

    steps.push({
      stepNumber: steps.length,
      mergedClusters: [minI, minJ],
      mergeDistance: dist,
      clusterContents: nodes.map(() => []),
      matrixSnapshot: cloneMatrix(matrix),
      treeState: JSON.parse(JSON.stringify({
        id: 'root', name: 'root', distance: 0, children: [...nodes],
      })),
      description: `Joined ${labelA} + ${labelB} at distance ${dist.toFixed(4)}`,
    })
  }

  if (nodes.length === 2) {
    const dist = matrix[0][1] || 0
    const parent: TreeNode = {
      id: `node-${n + steps.length - 1}`,
      name: `(${currentLabels[0]}+${currentLabels[1]})`,
      distance: dist,
      children: [nodes[0], nodes[1]],
      mergeStep: steps.length,
      mergeDistance: dist,
    }

    steps.push({
      stepNumber: steps.length,
      mergedClusters: [0, 1],
      mergeDistance: dist,
      clusterContents: [[0, 1]],
      matrixSnapshot: [[0]],
      treeState: JSON.parse(JSON.stringify({
        id: 'root', name: 'root', distance: 0, children: [parent],
      })),
      description: `Final join at distance ${dist.toFixed(4)}`,
    })
  }

  return steps
}
