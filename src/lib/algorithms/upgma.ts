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
  const activeNodes: (TreeNode | null)[] = labels.map((l, i) => buildLeaf(l, i))
  let matrix = cloneMatrix(distanceMatrix)

  const initialTree: TreeNode = {
    id: 'root',
    name: 'root',
    distance: 0,
    children: labels.map((l, i) => buildLeaf(l, i)),
  }
  steps.push({
    stepNumber: 0,
    mergedClusters: [-1, -1],
    mergeDistance: 0,
    clusterContents: clusters.map(c => c.indices),
    matrixSnapshot: cloneMatrix(matrix),
    treeState: JSON.parse(JSON.stringify(initialTree)),
    description: 'Initial: all sequences as separate leaves',
  })

  let nextId = n
  while (clusters.length > 1) {
    let minDist = Infinity, minI = -1, minJ = -1
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        if (matrix[i][j] < minDist) {
          minDist = matrix[i][j]
          minI = i; minJ = j
        }
      }
    }

    const mergedIndices = [...clusters[minI].indices, ...clusters[minJ].indices]
    const mergedLabel = `(${currentLabels[minI]}+${currentLabels[minJ]})`

    const childA = activeNodes[minI]
    const childB = activeNodes[minJ]
    const parent: TreeNode = {
      id: `node-${nextId}`,
      name: mergedLabel,
      distance: minDist,
      children: [childA!, childB!].filter(Boolean),
      mergeStep: steps.length,
      mergeDistance: minDist,
    }

    const newSize = clusters[minI].size + clusters[minJ].size
    const newRow: number[] = []
    for (let k = 0; k < clusters.length; k++) {
      if (k !== minI && k !== minJ) {
        const d = (clusters[minI].size * matrix[minI][k] + clusters[minJ].size * matrix[minJ][k]) / newSize
        newRow.push(d)
      }
    }

    const newClusters: Cluster[] = []
    const newLabels: string[] = []
    const newNodes: (TreeNode | null)[] = []
    for (let k = 0; k < clusters.length; k++) {
      if (k !== minI && k !== minJ) {
        newClusters.push(clusters[k])
        newLabels.push(currentLabels[k])
        newNodes.push(activeNodes[k])
      }
    }
    newClusters.push({ size: newSize, indices: mergedIndices })
    newLabels.push(mergedLabel)
    newNodes.push(parent)

    const newMatrix: number[][] = newRow.map((_, idx) => {
      const row: number[] = []
      for (let k = 0; k < newRow.length; k++) {
        if (k < idx) {
          row.push(newMatrix[k][idx])
        } else if (k === idx) {
          row.push(0)
        } else {
          const origK = k >= newRow.length - 1 ? -1 : k
          row.push(origK >= 0 ? newRow[k] : newRow[idx])
        }
      }
      return row
    })

    const actualNewMatrix: number[][] = []
    const len = newClusters.length
    for (let i = 0; i < len; i++) {
      actualNewMatrix[i] = []
      for (let j = 0; j < len; j++) {
        if (i === j) { actualNewMatrix[i][j] = 0; continue }
        actualNewMatrix[i][j] = newMatrix[i]?.[j] ?? 0
      }
    }

    clusters = newClusters
    currentLabels = newLabels
    activeNodes.splice(0, activeNodes.length, ...newNodes)
    matrix = actualNewMatrix

    const partialTree: TreeNode = {
      id: 'root',
      name: 'root',
      distance: 0,
      children: activeNodes.filter(Boolean) as TreeNode[],
    }

    steps.push({
      stepNumber: steps.length,
      mergedClusters: [minI, minJ],
      mergeDistance: minDist,
      clusterContents: clusters.map(c => c.indices),
      matrixSnapshot: cloneMatrix(matrix),
      treeState: JSON.parse(JSON.stringify(partialTree)),
      description: `Merged "${currentLabels[minI]}" + "${currentLabels[minJ]}" at distance ${minDist.toFixed(4)}`,
    })

    nextId++
  }

  return steps
}
