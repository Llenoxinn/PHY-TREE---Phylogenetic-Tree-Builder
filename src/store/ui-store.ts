import { create } from 'zustand'
import type { PaletteName } from '../lib/utils/colors'

export type BranchStyle = 'elbow' | 'curved' | 'diagonal'

interface TreeSettings {
  branchStyle: BranchStyle
  branchWidth: number
  branchColor: string
  nodeSize: number
  labelSize: number
  showLabels: boolean
  showDistances: boolean
  showScaleBar: boolean
  showGuideCircle: boolean
  leafShape: 'circle' | 'diamond' | 'square'
}

interface UIStore {
  showHeatmap: boolean
  showExplainer: boolean
  showNodePanel: boolean
  showTreeSettings: boolean
  palette: PaletteName
  theme: 'light' | 'dark'
  treeSettings: TreeSettings
  toggleHeatmap: () => void
  toggleExplainer: () => void
  toggleNodePanel: () => void
  toggleTreeSettings: () => void
  setPalette: (p: PaletteName) => void
  setTheme: (t: 'light' | 'dark') => void
  setTreeSettings: (s: Partial<TreeSettings>) => void
}

const DEFAULT_TREE_SETTINGS: TreeSettings = {
  branchStyle: 'curved',
  branchWidth: 1.5,
  branchColor: '',
  nodeSize: 4,
  labelSize: 11,
  showLabels: true,
  showDistances: true,
  showScaleBar: true,
  showGuideCircle: true,
  leafShape: 'circle',
}

export const useUIStore = create<UIStore>((set) => ({
  showHeatmap: false,
  showExplainer: false,
  showNodePanel: false,
  showTreeSettings: false,
  palette: 'default',
  theme: 'light',
  treeSettings: DEFAULT_TREE_SETTINGS,
  toggleHeatmap: () => set(s => ({ showHeatmap: !s.showHeatmap })),
  toggleExplainer: () => set(s => ({ showExplainer: !s.showExplainer })),
  toggleNodePanel: () => set(s => ({ showNodePanel: !s.showNodePanel })),
  toggleTreeSettings: () => set(s => ({ showTreeSettings: !s.showTreeSettings })),
  setPalette: (p: PaletteName) => set({ palette: p }),
  setTheme: (t: 'light' | 'dark') => set({ theme: t }),
  setTreeSettings: (s) => set(state => ({ treeSettings: { ...state.treeSettings, ...s } })),
}))
