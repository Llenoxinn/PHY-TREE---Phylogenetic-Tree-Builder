import { create } from 'zustand'
import type { Sequence, ValidationError } from '../types'
import { sequencesFromText } from '../lib/io/fasta-parser'
import { validateAll } from '../lib/validation/sequence-validator'

interface SequenceStore {
  sequences: Sequence[]
  validationErrors: ValidationError[][]
  hoveredIndex: number | null
  rawInput: string
  setRawInput: (text: string) => void
  loadFasta: (text: string) => void
  updateLabel: (index: number, label: string) => void
  setHovered: (index: number | null) => void
  removeSequence: (index: number) => void
}

export const useSequenceStore = create<SequenceStore>((set, get) => ({
  sequences: [],
  validationErrors: [],
  hoveredIndex: null,
  rawInput: '',
  setRawInput: (text: string) => {
    set({ rawInput: text })
    if (text.trim()) {
      const seqs = sequencesFromText(text)
      const errors = validateAll(seqs)
      set({ sequences: seqs, validationErrors: errors })
    } else {
      set({ sequences: [], validationErrors: [] })
    }
  },
  loadFasta: (text: string) => {
    const seqs = sequencesFromText(text)
    const errors = validateAll(seqs)
    set({ rawInput: text, sequences: seqs, validationErrors: errors })
  },
  updateLabel: (index: number, label: string) => {
    const seqs = [...get().sequences]
    if (seqs[index]) seqs[index] = { ...seqs[index], label }
    set({ sequences: seqs })
  },
  setHovered: (index: number | null) => set({ hoveredIndex: index }),
  removeSequence: (index: number) => {
    const seqs = get().sequences.filter((_, i) => i !== index)
    const errs = get().validationErrors.filter((_, i) => i !== index)
    set({ sequences: seqs, validationErrors: errs })
  },
}))
