import { useUIStore } from '../../store/ui-store'
import { useExport } from '../../hooks/use-export'
import { useTreeStore } from '../../store/tree-store'
import { toNewick } from '../../lib/io/newick-exporter'
import { matrixToCSV, downloadCSV } from '../../lib/utils/matrix'
import { useAlignmentStore } from '../../store/alignment-store'
import { useSequenceStore } from '../../store/sequence-store'
import { PhyTreeLogo } from './PhyTreeLogo'

export function Header() {
  const { palette, setPalette, theme, setTheme, toggleHeatmap, toggleExplainer, toggleNodePanel, showHeatmap, showExplainer, showNodePanel } = useUIStore()
  const { exportSVG, exportPNG } = useExport()
  const { fullTree } = useTreeStore()
  const { distanceMatrix } = useAlignmentStore()
  const { sequences } = useSequenceStore()

  const handleSVG = () => {
    const svg = document.querySelector('#tree-svg-container svg') as SVGSVGElement | null
    exportSVG(svg)
  }
  const handlePNG = () => {
    const svg = document.querySelector('#tree-svg-container svg') as SVGSVGElement | null
    exportPNG(svg)
  }
  const handleNewick = () => {
    if (!fullTree) return
    const newick = toNewick(fullTree)
    const blob = new Blob([newick], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'tree.newick'; a.click()
    URL.revokeObjectURL(url)
  }
  const handleCSV = () => {
    if (distanceMatrix.length === 0) return
    const csv = matrixToCSV(distanceMatrix, sequences.map(s => s.label))
    downloadCSV(csv)
  }

  return (
    <header className="h-10 bg-surface border-b border-border flex items-center px-3 gap-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        <PhyTreeLogo size={22} />
        <span className="text-sm font-semibold text-text-primary tracking-tight">PhyTree</span>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-0.5 text-[11px]">
        <span className="text-text-muted mr-1">Export</span>
        {[
          { label: 'SVG', fn: handleSVG, enabled: true },
          { label: 'PNG', fn: handlePNG, enabled: true },
          { label: 'Newick', fn: handleNewick, enabled: !!fullTree },
          { label: 'CSV', fn: handleCSV, enabled: distanceMatrix.length > 0 },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.fn}
            disabled={!btn.enabled}
            className="px-1.5 py-0.5 text-text-secondary hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-0.5 text-[11px]">
        <span className="text-text-muted mr-1">Palette</span>
        {(['default', 'colorblind', 'vibrant'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPalette(p)}
            className={`px-1.5 py-0.5 transition-colors ${palette === p ? 'text-blush-600 dark:text-blush-400 font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border" />

      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="px-1.5 py-0.5 text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-[11px]"
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>

      <div className="ml-auto flex items-center gap-2 text-[11px]">
        {[
          { label: 'Heatmap', checked: showHeatmap, toggle: toggleHeatmap },
          { label: 'Explain', checked: showExplainer, toggle: toggleExplainer },
          { label: 'Inspector', checked: showNodePanel, toggle: toggleNodePanel },
        ].map(item => (
          <label key={item.label} className="flex items-center gap-1 text-text-secondary hover:text-text-primary cursor-pointer select-none">
            <input type="checkbox" checked={item.checked} onChange={item.toggle} className="w-3 h-3 accent-blush-500 rounded-sm" />
            {item.label}
          </label>
        ))}
      </div>
    </header>
  )
}
