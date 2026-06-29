export interface Sequence {
  id: string
  header: string
  raw: string
  label: string
}

export interface ValidationError {
  index: number
  position: number
  character: string
}
