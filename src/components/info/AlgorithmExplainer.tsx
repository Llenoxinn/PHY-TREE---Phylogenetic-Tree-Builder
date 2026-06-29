import { useTreeStore } from '../../store/tree-store'

const EXPLANATIONS: Record<string, Record<string, string>> = {
  upgma: {
    title: 'UPGMA',
    desc: 'Simple hierarchical clustering that assumes all species evolve at the same rate (molecular clock). Produces an ultrametric tree where all leaves are equidistant from the root.',
  },
  'neighbor-joining': {
    title: 'Neighbor-Joining',
    desc: 'Corrects for unequal evolutionary rates. Finds neighbor pairs that minimize a transformed distance matrix, producing a more biologically accurate additive tree.',
  },
}

export function AlgorithmExplainer() {
  const { method, currentStep, steps } = useTreeStore()
  const info = EXPLANATIONS[method]

  if (!info) return null

  return (
    <div className="space-y-3 p-3 border border-blush-100 rounded-xl bg-blush-50/30">
      <div>
        <span className="text-xs font-bold text-blush-600">{info.title}</span>
        <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{info.desc}</p>
      </div>
      {steps.length > 0 && (
        <div className="border-t border-blush-100 pt-2">
          <span className="text-[10px] font-semibold text-blush-600">
            Step {currentStep} of {steps.length - 1}
          </span>
          <p className="text-[10px] text-gray-500 mt-1">
            {steps[currentStep]?.description}
          </p>
        </div>
      )}
    </div>
  )
}
