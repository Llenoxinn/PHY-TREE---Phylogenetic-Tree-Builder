# PhyTree

Interactive phylogenetic tree builder. Input DNA/protein sequences, compute pairwise alignments, and visualize evolutionary relationships with step-by-step algorithm replay.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3.js&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=zustand&logoColor=fff)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste sequences or select a preset, and the tree builds automatically.

## Features

- **Sequence Input** — Paste raw sequences or upload FASTA files
- **Scoring Matrices** — Simple DNA, BLOSUM62, PAM250 with configurable gap penalty
- **Alignment** — Needleman-Wunsch global alignment
- **Tree Methods** — UPGMA and Neighbor-Joining with step-by-step replay
- **Visualization** — Rectangular or circular layout with curved/elbow/diagonal branches
- **Tree Customization** — Branch style, width, node size, label size, leaf shapes
- **Node Inspection** — Click any node to view alignment details, distance, and subtree
- **Export** — SVG, PNG, Newick format, distance matrix CSV
- **Presets** — Great Apes, Mammals, Primates, Plants, Fish, Birds
- **Dark Mode** — Full dark theme support
- **Responsive** — Works on desktop, tablet, and mobile

## Tech Stack

React + TypeScript + Vite + Tailwind CSS + D3.js + Zustand — all algorithms are hand-rolled with no external bioinformatics libraries.

## Algorithms

| Algorithm | Purpose |
|-----------|---------|
| Needleman-Wunsch | Global sequence alignment |
| UPGMA | Distance-based tree construction (assumes molecular clock) |
| Neighbor-Joining | Distance-based tree construction (no molecular clock assumption) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom |
| `Space` | Play/pause step replay |
| `[` / `]` | Previous / next step |
| `L` | Toggle rectangular/circular layout |
| `M` | Switch tree method |

## License

MIT
