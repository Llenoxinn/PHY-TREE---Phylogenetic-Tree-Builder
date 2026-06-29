import { useTreeStore } from '../../store/tree-store'
import { useUIStore } from '../../store/ui-store'
import { useSequenceStore } from '../../store/sequence-store'

const EXPLANATIONS: Record<string, Record<string, string>> = {
  upgma: {
    title: 'UPGMA — Unweighted Pair Group Method with Arithmetic Mean',
    how: 'UPGMA is a hierarchical clustering algorithm. It starts with each sequence as its own cluster, then repeatedly merges the two closest clusters based on pairwise distances. When merging, the new distance to all other clusters is computed as the arithmetic mean of the old distances, weighted by cluster size.',
    key: 'The result is an ultrametric tree — all leaves are equidistant from the root. This assumes a molecular clock (constant rate of evolution), which is a simplification.',
    usage: 'Best for closely related sequences with similar evolutionary rates.',
  },
  'neighbor-joining': {
    title: 'Neighbor-Joining',
    how: 'Neighbor-Joining corrects for unequal evolutionary rates. It computes "net divergence" for each taxon, then finds the pair that minimizes a transformed distance. This correctly identifies neighbors without assuming a constant molecular clock.',
    key: 'Unlike UPGMA, NJ produces an additive tree where branch lengths reflect actual evolutionary distance. It does not produce an ultrametric tree.',
    usage: 'More accurate for divergent sequences or when evolutionary rates vary. The standard choice for most phylogenetic analyses.',
  },
}

export function AlgorithmExplainer() {
  const { method } = useTreeStore()
  const { showExplainer } = useUIStore()
  const { sequences } = useSequenceStore()

  if (!showExplainer) return null

  const info = EXPLANATIONS[method]
  if (!info) return null

  return (
    <div className="space-y-2 p-3 border rounded bg-gray-50">
      <div className="text-xs font-semibold">{info.title}</div>
      <p className="text-[11px] text-gray-600 leading-relaxed">{info.how}</p>
      <div className="text-[11px] space-y-1">
        <span className="font-medium">Key point: </span>
        <span className="text-gray-600">{info.key}</span>
      </div>
      <div className="text-[11px] space-y-1">
        <span className="font-medium">When to use: </span>
        <span className="text-gray-600">{info.usage}</span>
      </div>
      {sequences.length > 0 && (
        <div className="text-[10px] text-gray-400 pt-1 border-t">
          {sequences.length} taxa · {method === 'upgma' ? 'Ultrametric tree' : 'Additive tree'}
        </div>
      )}
    </div>
  )
}
