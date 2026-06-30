import { useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { SequenceInput } from './components/input/SequenceInput'
import { MethodSelector } from './components/controls/MethodSelector'
import { ScoringSelector } from './components/controls/ScoringSelector'
import { LayoutToggle } from './components/controls/LayoutToggle'
import { StepReplayControls } from './components/controls/StepReplayControls'
import { TreeCanvas } from './components/visualization/TreeCanvas'
import { DistanceMatrixHeatmap } from './components/visualization/DistanceMatrixHeatmap'
import { NodeInspectionPanel } from './components/visualization/NodeInspectionPanel'
import { MSAViewer } from './components/visualization/MSAViewer'
import { AlgorithmExplainer } from './components/info/AlgorithmExplainer'
import { ExamplePresets } from './components/info/ExamplePresets'
import { TreeSettings } from './components/controls/TreeSettings'
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
  const { showHeatmap, showExplainer, showNodePanel, showMSA } = useUIStore()
  const [activeTab, setActiveTab] = useState<'input' | 'howto'>('input')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

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

  // Auto-close panels on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
        setRightPanelOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleBuild = () => {
    runFullPipeline()
  }

  const showRightPanel = (showHeatmap || showExplainer || showNodePanel || showMSA) && hasData && rightPanelOpen

  return (
    <div className="h-screen flex flex-col bg-surface-alt text-text-primary">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        onTogglePanel={(toggle, isOpen) => {
          toggle()
          if (!isOpen && !rightPanelOpen) setRightPanelOpen(true)
        }}
        hasData={hasData}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed md:relative inset-y-0 left-0 z-30
          w-72 md:w-64 lg:w-72 flex-shrink-0 border-r border-border bg-surface flex flex-col
          transition-transform duration-200 ease-out
          md:translate-x-0
        `}>
          <div className="flex border-b border-border">
            {(['input', 'howto'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'text-blush-600 dark:text-blush-400 border-b-2 border-blush-500'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab === 'input' ? 'Input' : 'Guide'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeTab === 'input' ? (
              <>
                <SequenceInput />
                <div className="h-px bg-border" />
                <ScoringSelector />
                <MethodSelector />
                <LayoutToggle />
                <TreeSettings />
                <div className="h-px bg-border" />
                <ExamplePresets />
              </>
            ) : (
              <HowItWorksPanel />
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-surface-alt min-w-0">
          <WelcomeHero />

          {hasData && (
            <div className="flex-1 relative" id="tree-svg-container">
              {isComputing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/80">
                  <div className="flex items-center gap-2 bg-surface px-4 py-2 border border-border text-xs text-text-secondary">
                    <div className="w-3 h-3 border-2 border-blush-300 border-t-blush-600 rounded-full animate-spin" />
                    Computing alignments...
                  </div>
                </div>
              )}
              <TreeCanvas />
            </div>
          )}

          {hasData && (
            <div className="border-t border-border px-3 py-2 bg-surface flex-shrink-0">
              <StepReplayControls />
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={handleBuild}
                  disabled={sequences.length < 2}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded transition-colors ${
                    sequences.length < 2
                      ? 'bg-surface-hover text-text-muted cursor-not-allowed'
                      : 'bg-blush-500 text-white hover:bg-blush-600 active:bg-blush-700'
                  }`}
                >
                  {hasTree ? 'Re-Run' : 'Build Tree'}
                </button>
                {hasTree && (
                  <span className="text-[10px] text-text-muted font-mono">
                    {sequences.length} taxa
                  </span>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right panel */}
        {showRightPanel && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-20 lg:hidden"
              onClick={() => setRightPanelOpen(false)}
            />
            <aside className={`
              fixed lg:relative inset-y-0 right-0 z-30
              w-72 lg:w-80 flex-shrink-0 border-l border-border bg-surface overflow-y-auto
              transition-transform duration-200 ease-out
            `}>
              <div className="p-2 space-y-3">
                {showExplainer && <AlgorithmExplainer />}
                {showHeatmap && <DistanceMatrixHeatmap />}
                {showNodePanel && <NodeInspectionPanel />}
                {showMSA && <MSAViewer />}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  )
}

function HowItWorksPanel() {
  return (
    <div className="space-y-4 text-[11px]">
      <div>
        <h3 className="font-semibold text-text-primary text-xs mb-1 uppercase tracking-wider">Overview</h3>
        <p className="text-text-secondary leading-relaxed">
          Takes DNA sequences, computes pairwise distances via Needleman-Wunsch alignment,
          and renders an evolutionary tree using UPGMA or Neighbor-Joining.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-text-primary text-xs mb-1 uppercase tracking-wider">Steps</h3>
        <ol className="space-y-1.5 text-text-secondary">
          <li className="flex gap-2">
            <span className="text-text-muted font-mono w-4 text-right flex-shrink-0">01</span>
            <span>Paste sequences in FASTA format or one per line</span>
          </li>
          <li className="flex gap-2">
            <span className="text-text-muted font-mono w-4 text-right flex-shrink-0">02</span>
            <span>Select scoring matrix and gap penalty</span>
          </li>
          <li className="flex gap-2">
            <span className="text-text-muted font-mono w-4 text-right flex-shrink-0">03</span>
            <span>Click Build Tree to compute and render</span>
          </li>
          <li className="flex gap-2">
            <span className="text-text-muted font-mono w-4 text-right flex-shrink-0">04</span>
            <span>Step through algorithm, click nodes, zoom/pan</span>
          </li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold text-text-primary text-xs mb-1 uppercase tracking-wider">Methods</h3>
        <div className="space-y-1.5 text-text-secondary">
          <div className="flex gap-2">
            <span className="font-mono text-blush-500 dark:text-blush-400 w-10 flex-shrink-0">UPGMA</span>
            <span>Ultrametric, clock-like assumption</span>
          </div>
          <div className="flex gap-2">
            <span className="font-mono text-blush-500 dark:text-blush-400 w-10 flex-shrink-0">NJ</span>
            <span>Additive, rate-corrected</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-text-primary text-xs mb-1 uppercase tracking-wider">Keys</h3>
        <div className="grid grid-cols-2 gap-2 text-text-secondary">
          {[
            { key: 'Space', action: 'Play / Pause' },
            { key: '\u2190', action: 'Previous step' },
            { key: '\u2192', action: 'Next step' },
            { key: 'Home', action: 'First step' },
          ].map(k => (
            <div key={k.key} className="flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 bg-surface border border-border text-[9px] font-mono text-text-primary rounded">
                {k.key}
              </kbd>
              <span className="text-[10px]">{k.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
