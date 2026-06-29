import { useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { SequenceInput } from './components/input/SequenceInput'
import { SequenceLabels } from './components/input/SequenceLabels'
import { SequenceValidator } from './components/input/SequenceValidator'
import { MethodSelector } from './components/controls/MethodSelector'
import { ScoringSelector } from './components/controls/ScoringSelector'
import { LayoutToggle } from './components/controls/LayoutToggle'
import { StepReplayControls } from './components/controls/StepReplayControls'
import { TreeCanvas } from './components/visualization/TreeCanvas'
import { DistanceMatrixHeatmap } from './components/visualization/DistanceMatrixHeatmap'
import { NodeInspectionPanel } from './components/visualization/NodeInspectionPanel'
import { AlgorithmExplainer } from './components/info/AlgorithmExplainer'
import { ExamplePresets } from './components/info/ExamplePresets'
import { WelcomeHero } from './components/info/WelcomeHero'
import { useSequenceStore } from './store/sequence-store'
import { useAlignmentStore } from './store/alignment-store'
import { useTreeStore } from './store/tree-store'
import { useUIStore } from './store/ui-store'
import { SCORING_MATRICES } from './lib/algorithms/scoring-matrices'
import { computeDistanceMatrix, buildNxNMatrix } from './lib/algorithms/needleman-wunsch'

export function runFullPipeline() {
  const seqs = useSequenceStore.getState().sequences
  if (seqs.length < 2) return

  const { matrixType, gapPenalty } = useAlignmentStore.getState()
  const scoring = SCORING_MATRICES[matrixType]
  const seqStrings = seqs.map(s => s.raw)

  const pairwise = computeDistanceMatrix(seqStrings, scoring.matrix, gapPenalty)
  const distanceMatrix = buildNxNMatrix(seqStrings, pairwise)
  useAlignmentStore.setState({ pairwiseAlignments: pairwise, distanceMatrix })

  const labels = seqs.map(s => s.label)
  useTreeStore.getState().buildTree(labels, distanceMatrix)
}

export default function App() {
  const sequences = useSequenceStore(s => s.sequences)
  const rawInput = useSequenceStore(s => s.rawInput)
  const distanceMatrix = useAlignmentStore(s => s.distanceMatrix)
  const isComputing = useAlignmentStore(s => s.isComputing)
  const theme = useUIStore(s => s.theme)
  const { showHeatmap, showExplainer, showNodePanel } = useUIStore()
  const [activeTab, setActiveTab] = useState<'input' | 'howto'>('input')

  const hasData = sequences.length > 0
  const hasTree = distanceMatrix.length > 0

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    if (sequences.length >= 2) {
      const timer = setTimeout(() => runFullPipeline(), 30)
      return () => clearTimeout(timer)
    }
  }, [rawInput])

  const handleBuild = () => {
    runFullPipeline()
  }

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-blush-50/30 text-gray-900'}`}>
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <aside className={`w-80 flex-shrink-0 border-r flex flex-col ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-blush-100 bg-white'}`}>
          <div className="flex border-b border-blush-100">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-colors ${activeTab === 'input' ? 'text-blush-600 border-b-2 border-blush-500 bg-blush-50/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Sequences
            </button>
            <button
              onClick={() => setActiveTab('howto')}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-colors ${activeTab === 'howto' ? 'text-blush-600 border-b-2 border-blush-500 bg-blush-50/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              How It Works
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'input' ? (
              <>
                <SequenceInput />
                {hasData && <SequenceLabels />}
                {hasData && <SequenceValidator />}
                <div className="h-px bg-blush-100" />
                <ScoringSelector />
                <MethodSelector />
                <LayoutToggle />
                <div className="h-px bg-blush-100" />
                <ExamplePresets />
              </>
            ) : (
              <HowItWorksPanel />
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
          <WelcomeHero />

          {hasData && (
            <div className="flex-1 relative" id="tree-svg-container">
              {isComputing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                  <div className="flex items-center gap-3 bg-blush-50 px-5 py-3 rounded-xl border border-blush-200 shadow-sm">
                    <div className="w-4 h-4 border-2 border-blush-300 border-t-blush-600 rounded-full animate-spin" />
                    <span className="text-sm text-blush-600 font-medium">Computing alignments...</span>
                  </div>
                </div>
              )}
              <TreeCanvas />
            </div>
          )}

          {hasData && (
            <div className="border-t border-blush-100 p-3 bg-white flex-shrink-0">
              <StepReplayControls />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleBuild}
                  disabled={sequences.length < 2}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                    sequences.length < 2
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blush-500 text-white hover:bg-blush-600 hover:shadow-md active:scale-95'
                  }`}
                >
                  {hasTree ? 'Re-Run Analysis' : 'Build Tree'}
                </button>
                {hasTree && (
                  <span className="text-[11px] text-gray-400">
                    {sequences.length} taxa loaded
                  </span>
                )}
              </div>
            </div>
          )}
        </main>

        {(showHeatmap || showExplainer || showNodePanel) && hasData && (
          <aside className={`w-72 flex-shrink-0 border-l overflow-y-auto ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-blush-100 bg-white'}`}>
            <div className="p-3 space-y-4">
              {showExplainer && <AlgorithmExplainer />}
              {showHeatmap && <DistanceMatrixHeatmap />}
              {showNodePanel && <NodeInspectionPanel />}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function HowItWorksPanel() {
  return (
    <div className="space-y-5 text-xs">
      <div>
        <h3 className="font-bold text-blush-600 text-sm mb-2">What is PhyTree?</h3>
        <p className="text-gray-600 leading-relaxed">
          PhyTree is an interactive phylogenetic tree builder. It takes DNA sequences,
          computes pairwise genetic distances using alignment algorithms, and renders
          an evolutionary tree that shows how species or genes are related.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-blush-600 text-sm mb-2">Step-by-Step Guide</h3>
        <ol className="space-y-2 text-gray-600">
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-blush-100 text-blush-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
            <span><strong>Input sequences:</strong> Paste DNA sequences in FASTA format, or one per line. You can also upload a .fasta file.</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-blush-100 text-blush-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
            <span><strong>Choose scoring:</strong> Select a scoring matrix (Simple for DNA, BLOSUM62 for proteins) and gap penalty.</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-blush-100 text-blush-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
            <span><strong>Build the tree:</strong> Click "Build Tree" to compute pairwise alignments and render the evolutionary tree.</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 bg-blush-100 text-blush-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span>
            <span><strong>Explore:</strong> Use the replay controls to step through the algorithm. Click nodes to inspect. Zoom and pan.</span>
          </li>
        </ol>
      </div>

      <div>
        <h3 className="font-bold text-blush-600 text-sm mb-2">Tree Methods</h3>
        <div className="space-y-2">
          <div className="bg-blush-50 rounded-lg p-3">
            <span className="font-semibold text-gray-800">UPGMA</span>
            <p className="text-gray-500 mt-1">
              Simple hierarchical clustering. Assumes all species evolve at the same rate
              (molecular clock). Produces an ultrametric tree.
            </p>
          </div>
          <div className="bg-blush-50 rounded-lg p-3">
            <span className="font-semibold text-gray-800">Neighbor-Joining</span>
            <p className="text-gray-500 mt-1">
              More biologically accurate. Corrects for unequal evolutionary rates.
              Produces an additive tree with variable branch lengths.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-blush-600 text-sm mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-1 text-gray-500">
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">Space</kbd> Play/Pause</span>
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">&rarr;</kbd> Next step</span>
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">&larr;</kbd> Previous step</span>
          <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">Home</kbd> First step</span>
        </div>
      </div>
    </div>
  )
}
