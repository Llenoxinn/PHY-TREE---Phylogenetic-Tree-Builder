import type { TreeNode } from '../../types'

function sanitizeLabel(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, '_')
}

function toNewickNode(node: TreeNode, isRoot: boolean): string {
  const length = isRoot ? '' : `:${node.distance.toFixed(6)}`
  if (node.children.length === 0) {
    return `${sanitizeLabel(node.name)}${length}`
  }
  const kids = node.children.map(c => toNewickNode(c, false)).join(',')
  return `(${kids})${length}`
}

export function toNewick(root: TreeNode): string {
  // Tree states are wrapped in a synthetic 'root' holder; unwrap it once the tree is complete.
  let top = root
  while (top.children.length === 1) top = top.children[0]
  return toNewickNode(top, true) + ';'
}
