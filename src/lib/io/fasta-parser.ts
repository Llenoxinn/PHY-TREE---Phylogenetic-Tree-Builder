import type { Sequence } from '../../types'

export function parseFasta(text: string): Sequence[] {
  const lines = text.trim().split('\n')
  const sequences: Sequence[] = []
  let currentHeader = ''
  let currentRaw = ''
  let seqCount = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('>')) {
      if (currentHeader || currentRaw) {
        sequences.push({
          id: `seq-${seqCount}`,
          header: currentHeader,
          raw: currentRaw.toUpperCase(),
          label: currentHeader || `Sequence ${seqCount + 1}`,
        })
        seqCount++
      }
      currentHeader = trimmed.slice(1).trim()
      currentRaw = ''
    } else if (trimmed && !trimmed.startsWith(';')) {
      currentRaw += trimmed.replace(/\s/g, '')
    }
  }

  if (currentHeader || currentRaw) {
    sequences.push({
      id: `seq-${seqCount}`,
      header: currentHeader,
      raw: currentRaw.toUpperCase(),
      label: currentHeader || `Sequence ${seqCount + 1}`,
    })
  }

  return sequences
}

export function sequencesFromText(text: string): Sequence[] {
  if (text.trim().startsWith('>')) {
    return parseFasta(text)
  }
  const lines = text.trim().split('\n').filter(l => l.trim())
  return lines.map((line, i) => {
    const parts = line.split(/[,|\t]/)
    const label = parts[0]?.trim() || `Sequence ${i + 1}`
    const raw = parts.length > 1 ? parts.slice(1).join('') : parts[0]
    return { id: `seq-${i}`, header: label, raw: raw.toUpperCase(), label }
  })
}
