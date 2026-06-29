import { create } from 'zustand'
import type { PaletteName } from '../lib/utils/colors'

interface UIStore {
  showHeatmap: boolean
  showExplainer: boolean
  showNodePanel: boolean
  palette: PaletteName
  theme: 'light' | 'dark'
  toggleHeatmap: () => void
  toggleExplainer: () => void
  toggleNodePanel: () => void
  setPalette: (p: PaletteName) => void
  setTheme: (t: 'light' | 'dark') => void
}

export const useUIStore = create<UIStore>((set) => ({
  showHeatmap: true,
  showExplainer: true,
  showNodePanel: true,
  palette: 'default',
  theme: 'light',
  toggleHeatmap: () => set(s => ({ showHeatmap: !s.showHeatmap })),
  toggleExplainer: () => set(s => ({ showExplainer: !s.showExplainer })),
  toggleNodePanel: () => set(s => ({ showNodePanel: !s.showNodePanel })),
  setPalette: (p: PaletteName) => set({ palette: p }),
  setTheme: (t: 'light' | 'dark') => set({ theme: t }),
}))
