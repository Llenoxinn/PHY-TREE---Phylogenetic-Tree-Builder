export const COLOR_PALETTES = {
  default: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'],
  colorblind: ['#0072B2', '#E69F00', '#009E73', '#F0E442', '#56B4E9', '#D55E00', '#CC79A7', '#000000', '#999999', '#66CCEE'],
  vibrant: ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4'],
}

export type PaletteName = keyof typeof COLOR_PALETTES

export function getLeafColor(leafIndex: number, palette: PaletteName = 'default'): string {
  const p = COLOR_PALETTES[palette]
  return p[leafIndex % p.length]
}

export function cladeColor(cladeIndex: number, palette: PaletteName = 'default'): string {
  const p = COLOR_PALETTES[palette]
  return p[cladeIndex % p.length]
}

export function distanceToColor(d: number, alpha = 1): string {
  const r = Math.round(255 * d)
  const b = Math.round(255 * (1 - d))
  return `rgba(${r}, 0, ${b}, ${alpha})`
}
