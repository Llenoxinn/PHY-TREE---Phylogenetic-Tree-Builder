import { useUIStore, type BranchStyle } from '../../store/ui-store'

const BRANCH_STYLES: { value: BranchStyle; label: string; desc: string }[] = [
  { value: 'curved', label: 'Curved', desc: 'Smooth bezier curves' },
  { value: 'elbow', label: 'Elbow', desc: 'Right-angle connectors' },
  { value: 'diagonal', label: 'Diagonal', desc: 'Straight diagonal lines' },
]

const LEAF_SHAPES = [
  { value: 'circle' as const, label: 'Circle' },
  { value: 'diamond' as const, label: 'Diamond' },
  { value: 'square' as const, label: 'Square' },
]

export function TreeSettings() {
  const { treeSettings, setTreeSettings, showTreeSettings } = useUIStore()

  if (!showTreeSettings) return null

  return (
    <div className="border border-border p-3 space-y-3">
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Tree Style</span>

      {/* Branch Style */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-text-muted">Branches</label>
        <div className="flex border border-border">
          {BRANCH_STYLES.map(s => (
            <button
              key={s.value}
              onClick={() => setTreeSettings({ branchStyle: s.value })}
              className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                treeSettings.branchStyle === s.value
                  ? 'bg-blush-500 text-white'
                  : 'text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Branch Width */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-text-muted">Branch width</label>
          <span className="text-[10px] font-mono text-text-secondary">{treeSettings.branchWidth}px</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.25"
          value={treeSettings.branchWidth}
          onChange={(e) => setTreeSettings({ branchWidth: Number(e.target.value) })}
          className="w-full h-1 bg-border rounded appearance-none cursor-pointer accent-blush-500"
        />
      </div>

      {/* Node Size */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-text-muted">Node size</label>
          <span className="text-[10px] font-mono text-text-secondary">{treeSettings.nodeSize}px</span>
        </div>
        <input
          type="range"
          min="2"
          max="8"
          step="0.5"
          value={treeSettings.nodeSize}
          onChange={(e) => setTreeSettings({ nodeSize: Number(e.target.value) })}
          className="w-full h-1 bg-border rounded appearance-none cursor-pointer accent-blush-500"
        />
      </div>

      {/* Label Size */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-text-muted">Label size</label>
          <span className="text-[10px] font-mono text-text-secondary">{treeSettings.labelSize}px</span>
        </div>
        <input
          type="range"
          min="8"
          max="16"
          step="1"
          value={treeSettings.labelSize}
          onChange={(e) => setTreeSettings({ labelSize: Number(e.target.value) })}
          className="w-full h-1 bg-border rounded appearance-none cursor-pointer accent-blush-500"
        />
      </div>

      {/* Leaf Shape */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-text-muted">Leaf shape</label>
        <div className="flex border border-border">
          {LEAF_SHAPES.map(s => (
            <button
              key={s.value}
              onClick={() => setTreeSettings({ leafShape: s.value })}
              className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                treeSettings.leafShape === s.value
                  ? 'bg-blush-500 text-white'
                  : 'text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-1.5">
        {[
          { key: 'showLabels' as const, label: 'Show labels' },
          { key: 'showDistances' as const, label: 'Show distances' },
          { key: 'showScaleBar' as const, label: 'Show scale bar' },
          { key: 'showGuideCircle' as const, label: 'Guide circle (circular)' },
        ].map(toggle => (
          <label key={toggle.key} className="flex items-center gap-2 text-[10px] text-text-secondary hover:text-text-primary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={treeSettings[toggle.key]}
              onChange={() => setTreeSettings({ [toggle.key]: !treeSettings[toggle.key] })}
              className="w-3 h-3 accent-blush-500 rounded-sm"
            />
            {toggle.label}
          </label>
        ))}
      </div>
    </div>
  )
}
