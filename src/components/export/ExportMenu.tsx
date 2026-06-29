import { useUIStore } from '../../store/ui-store'
import { useExport } from '../../hooks/use-export'
import { useTreeStore } from '../../store/tree-store'
import { toNewick } from '../../lib/io/newick-exporter'
import { matrixToCSV, downloadCSV } from '../../lib/utils/matrix'
import { useAlignmentStore } from '../../store/alignment-store'
import { useSequenceStore } from '../../store/sequence-store'

export function ExportMenu() {
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
    <div className="space-y-2">
      <div>
        <label className="text-xs font-medium">Export</label>
        <div className="flex gap-1 mt-1">
          <button onClick={handleSVG} className="text-[10px] px-2 py-1 rounded border hover:bg-gray-100">SVG</button>
          <button onClick={handlePNG} className="text-[10px] px-2 py-1 rounded border hover:bg-gray-100">PNG</button>
          <button onClick={handleNewick} className="text-[10px] px-2 py-1 rounded border hover:bg-gray-100" disabled={!fullTree}>Newick</button>
          <button onClick={handleCSV} className="text-[10px] px-2 py-1 rounded border hover:bg-gray-100" disabled={distanceMatrix.length === 0}>CSV</button>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Palette</label>
        <div className="flex gap-1 mt-1">
          {(['default', 'colorblind', 'vibrant'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPalette(p)}
              className={`text-[10px] px-2 py-1 rounded border ${palette === p ? 'ring-1 ring-blue-400 bg-blue-50' : 'hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Theme</label>
        <div className="flex gap-1 mt-1">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`text-[10px] px-2 py-1 rounded border ${theme === t ? 'ring-1 ring-blue-400 bg-blue-50' : 'hover:bg-gray-100'}`}
            >
              {t === 'light' ? '☀ Light' : '☾ Dark'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Panels</label>
        <div className="flex flex-col gap-0.5 mt-1">
          <label className="flex items-center gap-1.5 text-[10px]">
            <input type="checkbox" checked={showHeatmap} onChange={toggleHeatmap} className="w-3 h-3" />
            Distance Heatmap
          </label>
          <label className="flex items-center gap-1.5 text-[10px]">
            <input type="checkbox" checked={showExplainer} onChange={toggleExplainer} className="w-3 h-3" />
            Algorithm Explainer
          </label>
          <label className="flex items-center gap-1.5 text-[10px]">
            <input type="checkbox" checked={showNodePanel} onChange={toggleNodePanel} className="w-3 h-3" />
            Node Inspector
          </label>
        </div>
      </div>
    </div>
  )
}
