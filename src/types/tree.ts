export type LayoutType = 'rectangular' | 'circular'
export type TreeMethod = 'upgma' | 'neighbor-joining'

export interface TreeNode {
  id: string
  name: string
  distance: number
  children: TreeNode[]
  originalIndex?: number
  mergeStep?: number
  mergeDistance?: number
}

export interface MergeStep {
  stepNumber: number
  mergedClusters: [number, number]
  mergeDistance: number
  clusterContents: number[][]
  matrixSnapshot: number[][]
  treeState: TreeNode
  description: string
}
