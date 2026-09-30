# PhyTree

An interactive, educational phylogenetic tree builder. Input DNA/protein sequences, compute pairwise alignments, and watch UPGMA and Neighbor-Joining build a tree one step at a time.

> **Scope:** PhyTree is a teaching and exploration tool. For publication-grade phylogenetics, use established software such as MEGA, IQ-TREE, RAxML, or the R package `ape`.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3.js&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=zustand&logoColor=fff)

## Background

Phylogenetic trees are fundamental tools in evolutionary biology, systematics, and comparative genomics. They represent hypotheses about the evolutionary relationships among biological entities, enabling researchers to infer ancestry, trace the spread of pathogens, classify organisms, and study gene duplication events. The construction of these trees relies on sequence alignment to quantify similarity, followed by clustering or distance-based algorithms to infer branching patterns.

PhyTree provides a hands-on, educational interface for building phylogenetic trees from DNA or protein sequences. Unlike command-line tools, it visualizes every step of the algorithm, making it well suited to teaching and learning molecular evolution concepts.

## Quick Start

```bash
npm install
npm run dev
npm test      # algorithm tests based on proven properties of each method
```

Open [http://localhost:5173](http://localhost:5173), paste sequences or select a preset, and the tree builds automatically.

## Features

- **Sequence Input** — Paste raw sequences or upload FASTA files
- **Scoring Matrices** — Simple DNA, BLOSUM62, PAM250 with configurable gap penalty
- **Alignment** — Needleman-Wunsch global sequence alignment
- **Distances** — Uncorrected p-distance (proportion of differing sites, gap columns excluded), or corrected for multiple substitutions: Jukes–Cantor for DNA, Poisson for protein. Pairs too divergent to correct are reported instead of silently producing a tree
- **Multiple Sequence Alignment** — Progressive MSA along the guide tree
- **Tree Methods** — UPGMA and Neighbor-Joining with step-by-step replay
- **Visualization** — Phylogram (branches drawn to scale, with a scale bar) or cladogram (branching order only); rectangular or circular layout with curved, elbow, or diagonal branches
- **Tree Customization** — Branch style, width, node size, label size, leaf shapes
- **Node Inspection** — Click any node to view alignment details, distance, and subtree
- **Export** — SVG, PNG, Newick (with branch lengths, readable by FigTree/iTOL), distance matrix CSV
- **Presets** — Great Apes, Mammals, Primates, Plants, Fish, Birds
- **Dark Mode** — Full dark theme support
- **Responsive** — Works on desktop, tablet, and mobile

## Algorithms

| Algorithm | Purpose | Reference |
|-----------|---------|-----------|
| Needleman-Wunsch | Global sequence alignment | Needleman & Wunsch (1970) |
| UPGMA | Distance-based tree construction (assumes molecular clock) | Sokal & Michener (1958) |
| Neighbor-Joining | Distance-based tree construction (no molecular clock assumption) | Saitou & Nei (1987) |
| Progressive MSA | Multiple alignment guided by the tree | Thompson et al. (1994) |

Branch lengths follow each method's definition: UPGMA places each merge at half the cluster distance (producing an ultrametric tree), and Neighbor-Joining uses the Saitou–Nei branch-length formula. Neighbor-Joining trees are unrooted; PhyTree roots them at the midpoint of the final join for display.

The default phylogram view draws each branch to scale, so UPGMA trees end all leaves at the same line while Neighbor-Joining trees do not. Branch lengths are also included in the Newick export.

### Distance corrections

| Model | Data | Formula | Not computable when | Reference |
|-------|------|---------|---------------------|-----------|
| p-distance | Any | d = p | — | Nei & Kumar (2000) |
| Jukes–Cantor | DNA | d = −¾ ln(1 − 4p/3) | p ≥ 0.75 | Jukes & Cantor (1969) |
| Poisson | Protein | d = −ln(1 − p) | p ≥ 1 | Zuckerkandl & Pauling (1965) |

### Testing

The test suite does not rely on copied worked examples. It generates trees with known branch lengths, derives their distance matrices, and checks each method against guarantees proven in the literature: Neighbor-Joining reconstructs any tree exactly from its additive distances (Saitou & Nei, 1987; Studier & Keppler, 1988; Atteson, 1999), UPGMA does the same for ultrametric distances (Sokal & Michener, 1958; Felsenstein, 2004), and three-taxon branch lengths match the closed form of Fitch & Margoliash (1967).

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

Atteson, K. (1999). The performance of neighbor-joining methods of phylogenetic reconstruction. *Algorithmica*, *25*(2–3), 251–278.

Felsenstein, J. (2004). *Inferring phylogenies*. Sinauer Associates.

Fitch, W. M., & Margoliash, E. (1967). Construction of phylogenetic trees. *Science*, *155*(3760), 279–284. https://doi.org/10.1126/science.155.3760.279

Henikoff, S., & Henikoff, J. G. (1992). Amino acid substitution matrices from protein blocks. *Proceedings of the National Academy of Sciences*, *89*(22), 10915–10919. https://doi.org/10.1073/pnas.89.22.10915

Jukes, T. H., & Cantor, C. R. (1969). Evolution of protein molecules. In H. N. Munro (Ed.), *Mammalian protein metabolism* (Vol. 3, pp. 21–132). Academic Press.

Needleman, S. B., & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins. *Journal of Molecular Biology*, *48*(3), 443–453. https://doi.org/10.1016/0022-2836(70)90057-4

Nei, M., & Kumar, S. (2000). *Molecular evolution and phylogenetics*. Oxford University Press.

Saitou, N., & Nei, M. (1987). The neighbor-joining method: A new method for reconstructing phylogenetic trees. *Molecular Biology and Evolution*, *4*(4), 406–425. https://doi.org/10.1093/oxfordjournals.molbev.a040454

Sokal, R. R., & Michener, C. D. (1958). A statistical method for evaluating systematic relationships. *University of Kansas Scientific Bulletin*, *28*(22), 1409–1438.

Studier, J. A., & Keppler, K. J. (1988). A note on the neighbor-joining algorithm of Saitou and Nei. *Molecular Biology and Evolution*, *5*(6), 729–731.

Thompson, J. D., Higgins, D. G., & Gibson, T. J. (1994). CLUSTAL W: Improving the sensitivity of progressive multiple sequence alignment through sequence weighting, position-specific gap penalties and weight matrix choice. *Nucleic Acids Research*, *22*(22), 4673–4680. https://doi.org/10.1093/nar/22.22.4673

Zuckerkandl, E., & Pauling, L. (1965). Evolutionary divergence and convergence in proteins. In V. Bryson & H. J. Vogel (Eds.), *Evolving genes and proteins* (pp. 97–166). Academic Press.

## License

MIT
