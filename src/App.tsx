import { useEffect, useCallback } from 'react'
import { Header } from './components/layout/Header'
import { Panel } from './components/layout/Panel'
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
import { ExportMenu } from './components/export/ExportMenu'
import { useSequenceStore } from './store/sequence-store'
import { useAlignmentStore } from './store/alignment-store'
import { useTreeStore } from './store/tree-store'
import { useUIStore } from './store/ui-store'

export default function App() {
  const sequences = useSequenceStore(s => s.sequences)
  const rawInput = useSequenceStore(s => s.rawInput)
  const distanceMatrix = useAlignmentStore(s => s.distanceMatrix)
  const isComputing = useAlignmentStore(s => s.isComputing)
  const compute = useAlignmentStore(s => s.compute)
  const buildTree = useTreeStore(s => s.buildTree)
  const theme = useUIStore(s => s.theme)

  const handleBuild = useCallback(() => {
    if (sequences.length < 2) return
    if (!distanceMatrix.length) {
      compute(sequences.map(s => s.raw))
    }
    const dm = useAlignmentStore.getState().distanceMatrix
    if (dm.length > 0) {
      buildTree(sequences.map(s => s.label), dm)
    }
  }, [sequences, distanceMatrix.length, compute, buildTree])

  useEffect(() => {
    if (sequences.length >= 2) {
      compute(sequences.map(s => s.raw))
    }
  }, [rawInput])

  useEffect(() => {
    if (distanceMatrix.length > 0) {
      buildTree(sequences.map(s => s.label), distanceMatrix)
    }
  }, [distanceMatrix])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <div className={`w-72 flex-shrink-0 border-r overflow-y-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <Panel>
            <SequenceInput />
            <SequenceLabels />
            <SequenceValidator />
            <hr />
            <ScoringSelector />
            <MethodSelector />
            <LayoutToggle />
            <hr />
            <div className="md:hidden">
              <ExamplePresets />
              <div className="mt-2"><ExportMenu /></div>
            </div>
          </Panel>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative" id="tree-svg-container">
            {sequences.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center space-y-2">
                  <p className="text-lg">Paste DNA sequences to begin</p>
                  <p className="text-sm">Use FASTA format or one sequence per line</p>
                  <p className="text-xs">Try an example preset from the sidebar</p>
                </div>
              </div>
            )}
            {isComputing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <div className="text-sm text-gray-500">Computing alignments...</div>
              </div>
            )}
            <TreeCanvas />
          </div>
          <div className={`border-t p-3 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <StepReplayControls />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleBuild}
                disabled={sequences.length < 2}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  sequences.length < 2
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {sequences.length < 2 ? 'Need 2+ sequences' : 'Build & Re-Run'}
              </button>
              <span className="text-[10px] text-gray-400 self-center">
                {distanceMatrix.length > 0 && `${sequences.length} taxa · matrix built`}
              </span>
            </div>
          </div>
        </div>

        <div className={`w-72 flex-shrink-0 border-l overflow-y-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <Panel>
            <AlgorithmExplainer />
            <DistanceMatrixHeatmap />
            <NodeInspectionPanel />
          </Panel>
        </div>
      </div>
    </div>
  )
}
