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
  let activeClusters = labels.map((_, i) => i)
  let clusterSizes = labels.map(() => 1)
  const activeNodes: (TreeNode | null)[] = labels.map((l, i) => buildLeaf(l, i))
  let nextId = n

  const initialTree: TreeNode = {
    id: 'root', name: 'root', distance: 0,
    children: labels.map((l, i) => buildLeaf(l, i)),
  }
  steps.push({
    stepNumber: 0, mergedClusters: [-1, -1], mergeDistance: 0,
    clusterContents: activeClusters.map(i => [i]),
    matrixSnapshot: cloneMatrix(matrix), treeState: JSON.parse(JSON.stringify(initialTree)),
    description: 'Initial: all sequences as separate leaves',
  })

  while (activeClusters.length > 2) {
    const m = activeClusters.length
    const r: number[] = []
    for (let i = 0; i < m; i++) {
      let sum = 0
      for (let j = 0; j < m; j++) sum += matrix[i][j]
      r.push(sum / (m - 2))
    }

    let minD = Infinity, minI = -1, minJ = -1
    for (let i = 0; i < m; i++) {
      for (let j = i + 1; j < m; j++) {
        const d = matrix[i][j] - r[i] - r[j]
        if (d < minD) { minD = d; minI = i; minJ = j }
      }
    }

    const dist = matrix[minI][minJ]

    const childI = activeNodes[minI]
    const childJ = activeNodes[minJ]
    const parent: TreeNode = {
      id: `node-${nextId}`,
      name: `(${currentLabels[minI]}+${currentLabels[minJ]})`,
      distance: dist,
      children: [childI!, childJ!].filter(Boolean),
      mergeStep: steps.length,
      mergeDistance: dist,
    }

    const newRow: number[] = []
    for (let k = 0; k < m; k++) {
      if (k !== minI && k !== minJ) {
        const d = (matrix[minI][k] + matrix[minJ][k] - dist) / 2
        newRow.push(d)
      }
    }

    const newClusters: number[] = []
    const newLabels: string[] = []
    const newNodes: (TreeNode | null)[] = []
    const newSizes: number[] = []
    for (let k = 0; k < m; k++) {
      if (k !== minI && k !== minJ) {
        newClusters.push(activeClusters[k])
        newLabels.push(currentLabels[k])
        newNodes.push(activeNodes[k])
        newSizes.push(clusterSizes[k])
      }
    }
    newClusters.push(-1)
    newLabels.push(`(${currentLabels[minI]}+${currentLabels[minJ]})`)
    newNodes.push(parent)
    newSizes.push(clusterSizes[minI] + clusterSizes[minJ])

    const newM = newClusters.length
    const newMatrix: number[][] = Array.from({ length: newM }, () => new Array(newM).fill(0))
    for (let i = 0; i < newM - 1; i++) {
      for (let j = 0; j < newM - 1; j++) {
        newMatrix[i][j] = matrix[i][j] ?? 0
      }
    }
    for (let k = 0; k < newM - 1; k++) {
      newMatrix[k][newM - 1] = newRow[k]
      newMatrix[newM - 1][k] = newRow[k]
    }

    activeClusters = newClusters
    currentLabels = newLabels
    activeNodes.splice(0, activeNodes.length, ...newNodes)
    clusterSizes = newSizes
    matrix = newMatrix

    const partialTree: TreeNode = {
      id: 'root', name: 'root', distance: 0,
      children: activeNodes.filter(Boolean) as TreeNode[],
    }
    steps.push({
      stepNumber: steps.length,
      mergedClusters: [minI, minJ],
      mergeDistance: dist,
      clusterContents: activeClusters.map(c => c === -1 ? [] : [c]),
      matrixSnapshot: cloneMatrix(matrix),
      treeState: JSON.parse(JSON.stringify(partialTree)),
      description: `Joined "${currentLabels[minI]}" + "${currentLabels[minJ]}" at distance ${dist.toFixed(4)}`,
    })
    nextId++
  }

  if (activeClusters.length === 2) {
    const dist = matrix[0][1]
    const parent: TreeNode = {
      id: `node-${nextId}`,
      name: `(${currentLabels[0]}+${currentLabels[1]})`,
      distance: dist,
      children: [activeNodes[0]!, activeNodes[1]!],
      mergeStep: steps.length,
      mergeDistance: dist,
    }
    activeNodes.splice(0, activeNodes.length, parent)
    currentLabels = [`(${currentLabels[0]}+${currentLabels[1]})`]

    const finalTree: TreeNode = {
      id: 'root', name: 'root', distance: 0,
      children: [parent],
    }
    steps.push({
      stepNumber: steps.length,
      mergedClusters: [0, 1],
      mergeDistance: dist,
      clusterContents: [[0, 1]],
      matrixSnapshot: [[0]],
      treeState: JSON.parse(JSON.stringify(finalTree)),
      description: `Final join: "${currentLabels[0]}" at distance ${dist.toFixed(4)}`,
    })
  }

  return steps
}
