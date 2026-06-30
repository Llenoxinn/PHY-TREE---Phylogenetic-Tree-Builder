import { create } from 'zustand'
import type { MergeStep, TreeNode, LayoutType, TreeMethod } from '../types'
import { computeUPGMA } from '../lib/algorithms/upgma'
import { computeNeighborJoining } from '../lib/algorithms/neighbor-joining'

interface TreeStore {
  steps: MergeStep[]
  currentStep: number
  fullTree: TreeNode | null
  isPlaying: boolean
  playSpeed: number
  selectedNode: TreeNode | null
  method: TreeMethod
  layoutType: LayoutType
  upgmaSteps: MergeStep[]
  njSteps: MergeStep[]
  upgmaTree: TreeNode | null
  njTree: TreeNode | null
  setMethod: (m: TreeMethod) => void
  setLayoutType: (t: LayoutType) => void
  buildTree: (labels: string[], distanceMatrix: number[][]) => void
  goToStep: (n: number) => void
  play: () => void
  pause: () => void
  nextStep: () => void
  prevStep: () => void
  selectNode: (n: TreeNode | null) => void
  reset: () => void
  setPlaySpeed: (s: number) => void
}

export const useTreeStore = create<TreeStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  fullTree: null,
  isPlaying: false,
  playSpeed: 1000,
  selectedNode: null,
  method: 'upgma',
  layoutType: 'rectangular',
  upgmaSteps: [],
  njSteps: [],
  upgmaTree: null,
  njTree: null,
  setMethod: (m: TreeMethod) => set({ method: m }),
  setLayoutType: (t: LayoutType) => set({ layoutType: t }),
  buildTree: (labels: string[], distanceMatrix: number[][]) => {
    const { method } = get()
    const upgmaSteps = computeUPGMA(labels, distanceMatrix)
    const njSteps = computeNeighborJoining(labels, distanceMatrix)
    const upgmaTree = upgmaSteps[upgmaSteps.length - 1]?.treeState ?? null
    const njTree = njSteps[njSteps.length - 1]?.treeState ?? null
    const activeSteps = method === 'upgma' ? upgmaSteps : njSteps
    const activeTree = method === 'upgma' ? upgmaTree : njTree
    set({
      upgmaSteps,
      njSteps,
      upgmaTree,
      njTree,
      steps: activeSteps,
      fullTree: activeTree,
      currentStep: 0,
      isPlaying: false,
      selectedNode: null,
    })
  },
  goToStep: (n: number) => {
    const { steps } = get()
    set({ currentStep: Math.max(0, Math.min(n, steps.length - 1)) })
  },
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  nextStep: () => {
    const { steps, currentStep } = get()
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 })
    else set({ isPlaying: false })
  },
  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },
  selectNode: (n: TreeNode | null) => set({ selectedNode: n }),
  reset: () => set({
    steps: [], currentStep: 0, fullTree: null, isPlaying: false,
    selectedNode: null, upgmaSteps: [], njSteps: [], upgmaTree: null, njTree: null,
  }),
  setPlaySpeed: (s: number) => set({ playSpeed: s }),
}))
