export function matrixToCSV(matrix: number[][], labels: string[]): string {
  const header = ['', ...labels].join(',')
  const rows = matrix.map((row, i) => [labels[i], ...row.map(v => v.toFixed(4))].join(','))
  return [header, ...rows].join('\n')
}

export function downloadCSV(csv: string, filename = 'distance-matrix.csv'): void {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
