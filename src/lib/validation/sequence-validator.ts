import type { ValidationError } from '../../types'

const VALID_DNA = new Set('ACGTRYSWKMBDHVN')
const VALID_RNA = new Set('ACGURYSWKMBDHVN')

export function validateSequence(raw: string, type: 'dna' | 'rna' = 'dna'): ValidationError[] {
  const errors: ValidationError[] = []
  const validChars = type === 'dna' ? VALID_DNA : VALID_RNA
  for (let pos = 0; pos < raw.length; pos++) {
    const char = raw[pos].toUpperCase()
    if (!validChars.has(char)) {
      errors.push({ index: 0, position: pos, character: raw[pos] })
    }
  }
  return errors
}

export function validateAll(sequences: { raw: string }[], type: 'dna' | 'rna' = 'dna'): ValidationError[][] {
  return sequences.map((seq, i) => {
    const errors = validateSequence(seq.raw, type)
    return errors.map(e => ({ ...e, index: i }))
  })
}

export function isValidNucleotide(c: string): boolean {
  return VALID_DNA.has(c.toUpperCase())
}
