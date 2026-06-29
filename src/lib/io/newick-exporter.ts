import type { TreeNode } from '../../types'

function newNodeick(node: TreeNode): string {
  if (node.children.length === 0) {
    const d = node.distance > 0 ? `:${node.distance.toFixed(6)}` : ''
    return `${node.name.replace(/[^a-zA-Z0-9_\-]/g, '_')}${d}`
  }
  const kids = node.children.map(c => newNodeick(c)).join(',')
  const d = node.distance > 0 ? `:${node.distance.toFixed(6)}` : ''
  return `(${kids})${d}`
}

export function toNewick(root: TreeNode): string {
  return newNodeick(root) + ';'
}
