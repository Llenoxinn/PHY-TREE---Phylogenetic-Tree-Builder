import { useUIStore } from '../../store/ui-store'
import { useExport } from '../../hooks/use-export'
import { useTreeStore } from '../../store/tree-store'
import { toNewick } from '../../lib/io/newick-exporter'
import { matrixToCSV, downloadCSV } from '../../lib/utils/matrix'
import { useAlignmentStore } from '../../store/alignment-store'
import { useSequenceStore } from '../../store/sequence-store'

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
    <header className="h-14 bg-surface border-b border-border flex items-center px-5 gap-4 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blush-500 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-text-primary leading-tight">PhyTree</h1>
          <p className="text-[10px] text-blush-400 font-medium leading-tight">Phylogenetic Tree Builder</p>
        </div>
      </div>

      <div className="h-6 w-px bg-border mx-2" />

      <nav className="flex items-center gap-1 text-xs">
        <span className="text-text-muted mr-1">Export:</span>
        <button onClick={handleSVG} className="px-2 py-1 rounded hover:bg-blush-50 dark:hover:bg-surface-hover text-text-secondary hover:text-blush-600 transition-colors">SVG</button>
        <button onClick={handlePNG} className="px-2 py-1 rounded hover:bg-blush-50 dark:hover:bg-surface-hover text-text-secondary hover:text-blush-600 transition-colors">PNG</button>
        <button onClick={handleNewick} className="px-2 py-1 rounded hover:bg-blush-50 dark:hover:bg-surface-hover text-text-secondary hover:text-blush-600 transition-colors" disabled={!fullTree}>Newick</button>
        <button onClick={handleCSV} className="px-2 py-1 rounded hover:bg-blush-50 dark:hover:bg-surface-hover text-text-secondary hover:text-blush-600 transition-colors" disabled={distanceMatrix.length === 0}>CSV</button>
      </nav>

      <div className="h-6 w-px bg-border mx-2" />

      <div className="flex items-center gap-1 text-xs">
        <span className="text-text-muted mr-1">Palette:</span>
        {(['default', 'colorblind', 'vibrant'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPalette(p)}
            className={`px-2 py-1 rounded transition-colors ${palette === p ? 'bg-blush-100 dark:bg-blush-900/30 text-blush-700 dark:text-blush-400 font-medium' : 'text-text-secondary hover:bg-blush-50 dark:hover:bg-surface-hover'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-border mx-2" />

      <div className="flex items-center gap-1 text-xs">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-2 py-1 rounded hover:bg-blush-50 dark:hover:bg-surface-hover text-text-secondary"
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1 text-xs">
        <label className="flex items-center gap-1 text-text-secondary hover:text-blush-600 cursor-pointer">
          <input type="checkbox" checked={showHeatmap} onChange={toggleHeatmap} className="w-3 h-3 accent-blush-500" />
          <span>Heatmap</span>
        </label>
        <label className="flex items-center gap-1 text-text-secondary hover:text-blush-600 cursor-pointer">
          <input type="checkbox" checked={showExplainer} onChange={toggleExplainer} className="w-3 h-3 accent-blush-500" />
          <span>Explain</span>
        </label>
        <label className="flex items-center gap-1 text-text-secondary hover:text-blush-600 cursor-pointer">
          <input type="checkbox" checked={showNodePanel} onChange={toggleNodePanel} className="w-3 h-3 accent-blush-500" />
          <span>Inspector</span>
        </label>
      </div>
    </header>
  )
}
