import { ExamplePresets } from '../info/ExamplePresets'
import { ExportMenu } from '../export/ExportMenu'

export function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-800">PhyTree</span>
        <span className="text-[10px] text-gray-400 hidden sm:inline">Phylogenetic Tree Builder</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <ExamplePresets />
        </div>
        <div className="hidden md:block">
          <ExportMenu />
        </div>
      </div>
    </div>
  )
}
