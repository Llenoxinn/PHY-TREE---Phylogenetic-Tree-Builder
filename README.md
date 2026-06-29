# PhyTree — Phylogenetic Tree Builder

Input DNA sequences, compute pairwise alignments, and render an interactive evolutionary tree.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste sequences, and the tree builds automatically.

## Features

- **Input**: Paste raw sequences or upload FASTA files
- **Algorithms**: Needleman-Wunsch global alignment, UPGMA, Neighbor-Joining
- **Visualization**: Rectangular or circular tree layout with D3.js
- **Interactivity**: Zoom/pan, node inspection, step-by-step replay
- **Scoring**: Simple DNA matrix, BLOSUM62, PAM250 with configurable gap penalty
- **Export**: SVG, PNG, Newick format, distance matrix CSV
- **Presets**: Great Apes, COVID variants, Cytochrome C, random generator

## Tech Stack

React + TypeScript + Vite + Tailwind CSS + D3.js + Zustand

All algorithms are hand-rolled (no external bioinformatics libraries).
