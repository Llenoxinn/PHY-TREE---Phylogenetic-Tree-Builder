# PhyTree

Interactive phylogenetic tree builder. Input DNA/protein sequences, compute pairwise alignments, and visualize evolutionary relationships with step-by-step algorithm replay.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3.js&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=zustand&logoColor=fff)

## Background

Phylogenetic trees are fundamental tools in evolutionary biology, systematics, and comparative genomics. They represent hypotheses about the evolutionary relationships among biological entities, enabling researchers to infer ancestry, trace the spread of pathogens, classify organisms, and study gene duplication events. The construction of these trees relies on sequence alignment to quantify similarity, followed by clustering or distance-based algorithms to infer branching patterns.

PhyTree provides a hands-on, educational interface for building phylogenetic trees from DNA or protein sequences. Unlike command-line tools, it visualizes every step of the algorithm, making it useful for both research prototyping and teaching molecular evolution concepts.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste sequences or select a preset, and the tree builds automatically.

## Features

- **Sequence Input** — Paste raw sequences or upload FASTA files
- **Scoring Matrices** — Simple DNA, BLOSUM62, PAM250 with configurable gap penalty
- **Alignment** — Needleman-Wunsch global sequence alignment
- **Tree Methods** — UPGMA and Neighbor-Joining with step-by-step replay
- **Visualization** — Rectangular or circular layout with curved, elbow, or diagonal branches
- **Tree Customization** — Branch style, width, node size, label size, leaf shapes
- **Node Inspection** — Click any node to view alignment details, distance, and subtree
- **Export** — SVG, PNG, Newick format, distance matrix CSV
- **Presets** — Great Apes, Mammals, Primates, Plants, Fish, Birds
- **Dark Mode** — Full dark theme support
- **Responsive** — Works on desktop, tablet, and mobile

## Algorithms

| Algorithm | Purpose | Reference |
|-----------|---------|-----------|
| Needleman-Wunsch | Global sequence alignment | Needleman & Wunsch (1970) |
| UPGMA | Distance-based tree construction (assumes molecular clock) | Sokal & Michener (1958) |
| Neighbor-Joining | Distance-based tree construction (no molecular clock assumption) | Saitou & Nei (1987) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `+` / `-` | Zoom in / out |
| `0` | Reset zoom |
| `Space` | Play/pause step replay |
| `[` / `]` | Previous / next step |
| `L` | Toggle rectangular/circular layout |
| `M` | Switch tree method |

## Tech Stack

React + TypeScript + Vite + Tailwind CSS + D3.js + Zustand — all algorithms are hand-rolled with no external bioinformatics libraries.

## References

Felsenstein, J. (1985). Confidence limits on phylogenies: An approach using the bootstrap. *Evolution*, *39*(4), 783–791. https://doi.org/10.1111/j.1558-5646.1985.tb00420.x

Henikoff, S., & Henikoff, J. G. (1992). Amino acid substitution matrices from protein blocks. *Proceedings of the National Academy of Sciences*, *89*(22), 10915–10919. https://doi.org/10.1073/pnas.89.22.10915

Needleman, S. B., & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins. *Journal of Molecular Biology*, *48*(3), 443–453. https://doi.org/10.1016/0022-2836(70)90057-4

Saitou, N., & Nei, M. (1987). The neighbor-joining method: A new method for reconstructing phylogenetic trees. *Molecular Biology and Evolution*, *4*(4), 406–425. https://doi.org/10.1093/oxfordjournals.molbev.a040454

Sokal, R. R., & Michener, C. D. (1958). A statistical method for evaluating systematic relationships. *University of Kansas Scientific Bulletin*, *28*(22), 1409–1438.

Thompson, J. D., Higgins, D. G., & Gibson, T. J. (1994). CLUSTAL W: Improving the sensitivity of progressive multiple sequence alignment through sequence weighting, position-specific gap penalties and weight matrix choice. *Nucleic Acids Research*, *22*(22), 4673–4680. https://doi.org/10.1093/nar/22.22.4673

## License

MIT
