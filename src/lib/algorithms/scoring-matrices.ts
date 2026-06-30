const NUCLEOTIDES = ['A', 'C', 'G', 'T', 'U', 'N']

function simpleMatrix(match: number, mismatch: number): Record<string, Record<string, number>> {
  const m: Record<string, Record<string, number>> = {}
  for (const a of NUCLEOTIDES) {
    m[a] = {}
    for (const b of NUCLEOTIDES) {
      m[a][b] = a === b ? match : mismatch
    }
  }
  return m
}

const BLOSUM62_DATA: Record<string, number> = {
  'A A': 4, 'A R': -1, 'A N': -2, 'A D': -2, 'A C': 0, 'A Q': -1, 'A E': -1, 'A G': 0, 'A H': -2, 'A I': -1, 'A L': -1, 'A K': -1, 'A M': -1, 'A F': -2, 'A P': -1, 'A S': 1, 'A T': 0, 'A W': -3, 'A Y': -2, 'A V': 0,
  'R A': -1, 'R R': 5, 'R N': 0, 'R D': -2, 'R C': -3, 'R Q': 1, 'R E': 0, 'R G': -2, 'R H': 0, 'R I': -3, 'R L': -2, 'R K': 2, 'R M': -1, 'R F': -3, 'R P': -2, 'R S': -1, 'R T': -1, 'R W': -3, 'R Y': -2, 'R V': -3,
  'N A': -2, 'N R': 0, 'N N': 6, 'N D': 1, 'N C': -3, 'N Q': 0, 'N E': 0, 'N G': 0, 'N H': 1, 'N I': -3, 'N L': -3, 'N K': 0, 'N M': -2, 'N F': -3, 'N P': -2, 'N S': 1, 'N T': 0, 'N W': -4, 'N Y': -2, 'N V': -3,
  'D A': -2, 'D R': -2, 'D N': 1, 'D D': 6, 'D C': -3, 'D Q': 0, 'D E': 2, 'D G': -1, 'D H': -1, 'D I': -3, 'D L': -4, 'D K': -1, 'D M': -3, 'D F': -3, 'D P': -1, 'D S': 0, 'D T': -1, 'D W': -4, 'D Y': -3, 'D V': -3,
  'C A': 0, 'C R': -3, 'C N': -3, 'C D': -3, 'C C': 9, 'C Q': -3, 'C E': -4, 'C G': -3, 'C H': -3, 'C I': -1, 'C L': -1, 'C K': -3, 'C M': -1, 'C F': -2, 'C P': -3, 'C S': -1, 'C T': -1, 'C W': -2, 'C Y': -2, 'C V': -1,
  'Q A': -1, 'Q R': 1, 'Q N': 0, 'Q D': 0, 'Q C': -3, 'Q Q': 5, 'Q E': 2, 'Q G': -2, 'Q H': 0, 'Q I': -3, 'Q L': -2, 'Q K': 1, 'Q M': 0, 'Q F': -3, 'Q P': -1, 'Q S': 0, 'Q T': -1, 'Q W': -2, 'Q Y': -1, 'Q V': -2,
  'E A': -1, 'E R': 0, 'E N': 0, 'E D': 2, 'E C': -4, 'E Q': 2, 'E E': 5, 'E G': -2, 'E H': 0, 'E I': -3, 'E L': -3, 'E K': 1, 'E M': -2, 'E F': -3, 'E P': -1, 'E S': 0, 'E T': -1, 'E W': -3, 'E Y': -2, 'E V': -2,
  'G A': 0, 'G R': -2, 'G N': 0, 'G D': -1, 'G C': -3, 'G Q': -2, 'G E': -2, 'G G': 6, 'G H': -2, 'G I': -4, 'G L': -4, 'G K': -2, 'G M': -3, 'G F': -3, 'G P': -2, 'G S': 0, 'G T': -2, 'G W': -2, 'G Y': -3, 'G V': -3,
  'H A': -2, 'H R': 0, 'H N': 1, 'H D': -1, 'H C': -3, 'H Q': 0, 'H E': 0, 'H G': -2, 'H H': 8, 'H I': -3, 'H L': -3, 'H K': -1, 'H M': -2, 'H F': -1, 'H P': -2, 'H S': -1, 'H T': -2, 'H W': -2, 'H Y': 2, 'H V': -3,
  'I A': -1, 'I R': -3, 'I N': -3, 'I D': -3, 'I C': -1, 'I Q': -3, 'I E': -3, 'I G': -4, 'I H': -3, 'I I': 4, 'I L': 2, 'I K': -3, 'I M': 1, 'I F': 0, 'I P': -3, 'I S': -2, 'I T': -1, 'I W': -3, 'I Y': -1, 'I V': 3,
  'L A': -1, 'L R': -2, 'L N': -3, 'L D': -4, 'L C': -1, 'L Q': -2, 'L E': -3, 'L G': -4, 'L H': -3, 'L I': 2, 'L L': 4, 'L K': -2, 'L M': 2, 'L F': 0, 'L P': -3, 'L S': -2, 'L T': -1, 'L W': -2, 'L Y': -1, 'L V': 1,
  'K A': -1, 'K R': 2, 'K N': 0, 'K D': -1, 'K C': -3, 'K Q': 1, 'K E': 1, 'K G': -2, 'K H': -1, 'K I': -3, 'K L': -2, 'K K': 5, 'K M': -1, 'K F': -3, 'K P': -1, 'K S': 0, 'K T': -1, 'K W': -3, 'K Y': -2, 'K V': -2,
  'M A': -1, 'M R': -1, 'M N': -2, 'M D': -3, 'M C': -1, 'M Q': 0, 'M E': -2, 'M G': -3, 'M H': -2, 'M I': 1, 'M L': 2, 'M K': -1, 'M M': 5, 'M F': 0, 'M P': -2, 'M S': -1, 'M T': -1, 'M W': -1, 'M Y': -1, 'M V': 1,
  'F A': -2, 'F R': -3, 'F N': -3, 'F D': -3, 'F C': -2, 'F Q': -3, 'F E': -3, 'F G': -3, 'F H': -1, 'F I': 0, 'F L': 0, 'F K': -3, 'F M': 0, 'F F': 6, 'F P': -4, 'F S': -2, 'F T': -2, 'F W': 1, 'F Y': 3, 'F V': -1,
  'P A': -1, 'P R': -2, 'P N': -2, 'P D': -1, 'P C': -3, 'P Q': -1, 'P E': -1, 'P G': -2, 'P H': -2, 'P I': -3, 'P L': -3, 'P K': -1, 'P M': -2, 'P F': -4, 'P P': 7, 'P S': -1, 'P T': -1, 'P W': -4, 'P Y': -3, 'P V': -2,
  'S A': 1, 'S R': -1, 'S N': 1, 'S D': 0, 'S C': -1, 'S Q': 0, 'S E': 0, 'S G': 0, 'S H': -1, 'S I': -2, 'S L': -2, 'S K': 0, 'S M': -1, 'S F': -2, 'S P': -1, 'S S': 4, 'S T': 1, 'S W': -3, 'S Y': -2, 'S V': -2,
  'T A': 0, 'T R': -1, 'T N': 0, 'T D': -1, 'T C': -1, 'T Q': -1, 'T E': -1, 'T G': -2, 'T H': -2, 'T I': -1, 'T L': -1, 'T K': -1, 'T M': -1, 'T F': -2, 'T P': -1, 'T S': 1, 'T T': 5, 'T W': -2, 'T Y': -2, 'T V': 0,
  'W A': -3, 'W R': -3, 'W N': -4, 'W D': -4, 'W C': -2, 'W Q': -2, 'W E': -3, 'W G': -2, 'W H': -2, 'W I': -3, 'W L': -2, 'W K': -3, 'W M': -1, 'W F': 1, 'W P': -4, 'W S': -3, 'W T': -2, 'W W': 11, 'W Y': 2, 'W V': -3,
  'Y A': -2, 'Y R': -2, 'Y N': -2, 'Y D': -3, 'Y C': -2, 'Y Q': -1, 'Y E': -2, 'Y G': -3, 'Y H': 2, 'Y I': -1, 'Y L': -1, 'Y K': -2, 'Y M': -1, 'Y F': 3, 'Y P': -3, 'Y S': -2, 'Y T': -2, 'Y W': 2, 'Y Y': 7, 'Y V': -1,
  'V A': 0, 'V R': -3, 'V N': -3, 'V D': -3, 'V C': -1, 'V Q': -2, 'V E': -2, 'V G': -3, 'V H': -3, 'V I': 3, 'V L': 1, 'V K': -2, 'V M': 1, 'V F': -1, 'V P': -2, 'V S': -2, 'V T': 0, 'V W': -3, 'V Y': -1, 'V V': 4,
}

function buildBlosum62(): Record<string, Record<string, number>> {
  const m: Record<string, Record<string, number>> = {}
  const aminos = ['A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V']
  for (const a of aminos) {
    m[a] = {}
    for (const b of aminos) {
      m[a][b] = BLOSUM62_DATA[`${a} ${b}`] ?? -4
    }
  }
  return m
}

function buildPam250(): Record<string, Record<string, number>> {
  const PAM250_DATA: Record<string, number> = {
    'A A': 2, 'A R': -2, 'A N': 0, 'A D': 0, 'A C': -2, 'A Q': 0, 'A E': 0, 'A G': 1, 'A H': -1, 'A I': -1, 'A L': -2, 'A K': -1, 'A M': -1, 'A F': -3, 'A P': 1, 'A S': 1, 'A T': 1, 'A W': -6, 'A Y': -3, 'A V': 0,
    'R A': -2, 'R R': 6, 'R N': 0, 'R D': -1, 'R C': -4, 'R Q': 1, 'R E': -1, 'R G': -3, 'R H': 2, 'R I': -2, 'R L': -3, 'R K': 3, 'R M': 0, 'R F': -4, 'R P': 0, 'R S': 0, 'R T': -1, 'R W': 2, 'R Y': -4, 'R V': -2,
    'N A': 0, 'N R': 0, 'N N': 2, 'N D': 2, 'N C': -4, 'N Q': 1, 'N E': 1, 'N G': 0, 'N H': 2, 'N I': -2, 'N L': -3, 'N K': 1, 'N M': -2, 'N F': -3, 'N P': 0, 'N S': 1, 'N T': 0, 'N W': -4, 'N Y': -2, 'N V': -2,
    'D A': 0, 'D R': -1, 'D N': 2, 'D D': 4, 'D C': -5, 'D Q': 2, 'D E': 3, 'D G': 1, 'D H': 1, 'D I': -2, 'D L': -4, 'D K': 0, 'D M': -3, 'D F': -6, 'D P': -1, 'D S': 0, 'D T': 0, 'D W': -7, 'D Y': -4, 'D V': -2,
    'C A': -2, 'C R': -4, 'C N': -4, 'C D': -5, 'C C': 12, 'C Q': -5, 'C E': -5, 'C G': -3, 'C H': -3, 'C I': -2, 'C L': -6, 'C K': -5, 'C M': -5, 'C F': -4, 'C P': -3, 'C S': 0, 'C T': -2, 'C W': -8, 'C Y': 0, 'C V': -2,
    'Q A': 0, 'Q R': 1, 'Q N': 1, 'Q D': 2, 'Q C': -5, 'Q Q': 4, 'Q E': 2, 'Q G': -1, 'Q H': 3, 'Q I': -2, 'Q L': -2, 'Q K': 1, 'Q M': -1, 'Q F': -5, 'Q P': 0, 'Q S': -1, 'Q T': -1, 'Q W': -5, 'Q Y': -4, 'Q V': -2,
    'E A': 0, 'E R': -1, 'E N': 1, 'E D': 3, 'E C': -5, 'E Q': 2, 'E E': 4, 'E G': 0, 'E H': 1, 'E I': -2, 'E L': -3, 'E K': 0, 'E M': -2, 'E F': -5, 'E P': -1, 'E S': 0, 'E T': 0, 'E W': -7, 'E Y': -4, 'E V': -2,
    'G A': 1, 'G R': -3, 'G N': 0, 'G D': 1, 'G C': -3, 'G Q': -1, 'G E': 0, 'G G': 5, 'G H': -2, 'G I': -3, 'G L': -4, 'G K': -2, 'G M': -3, 'G F': -5, 'G P': 0, 'G S': 1, 'G T': 0, 'G W': -7, 'G Y': -5, 'G V': -1,
    'H A': -1, 'H R': 2, 'H N': 2, 'H D': 1, 'H C': -3, 'H Q': 3, 'H E': 1, 'H G': -2, 'H H': 6, 'H I': -2, 'H L': -2, 'H K': 0, 'H M': -2, 'H F': -2, 'H P': 0, 'H S': -1, 'H T': -1, 'H W': -3, 'H Y': 0, 'H V': -2,
    'I A': -1, 'I R': -2, 'I N': -2, 'I D': -2, 'I C': -2, 'I Q': -2, 'I E': -2, 'I G': -3, 'I H': -2, 'I I': 5, 'I L': 2, 'I K': -2, 'I M': 2, 'I F': 1, 'I P': -2, 'I S': -1, 'I T': 0, 'I W': -5, 'I Y': -1, 'I V': 4,
    'L A': -2, 'L R': -3, 'L N': -3, 'L D': -4, 'L C': -6, 'L Q': -2, 'L E': -3, 'L G': -4, 'L H': -2, 'L I': 2, 'L L': 6, 'L K': -3, 'L M': 4, 'L F': 2, 'L P': -3, 'L S': -3, 'L T': -2, 'L W': -2, 'L Y': -1, 'L V': 2,
    'K A': -1, 'K R': 3, 'K N': 1, 'K D': 0, 'K C': -5, 'K Q': 1, 'K E': 0, 'K G': -2, 'K H': 0, 'K I': -2, 'K L': -3, 'K K': 5, 'K M': 0, 'K F': -5, 'K P': -1, 'K S': 0, 'K T': 0, 'K W': -3, 'K Y': -4, 'K V': -2,
    'M A': -1, 'M R': 0, 'M N': -2, 'M D': -3, 'M C': -5, 'M Q': -1, 'M E': -2, 'M G': -3, 'M H': -2, 'M I': 2, 'M L': 4, 'M K': 0, 'M M': 6, 'M F': 0, 'M P': -2, 'M S': -2, 'M T': -1, 'M W': -4, 'M Y': -2, 'M V': 2,
    'F A': -3, 'F R': -4, 'F N': -3, 'F D': -6, 'F C': -4, 'F Q': -5, 'F E': -5, 'F G': -5, 'F H': -2, 'F I': 1, 'F L': 2, 'F K': -5, 'F M': 0, 'F F': 9, 'F P': -5, 'F S': -3, 'F T': -3, 'F W': 0, 'F Y': 7, 'F V': -1,
    'P A': 1, 'P R': 0, 'P N': 0, 'P D': -1, 'P C': -3, 'P Q': 0, 'P E': -1, 'P G': 0, 'P H': 0, 'P I': -2, 'P L': -3, 'P K': -1, 'P M': -2, 'P F': -5, 'P P': 6, 'P S': 1, 'P T': 0, 'P W': -6, 'P Y': -5, 'P V': -1,
    'S A': 1, 'S R': 0, 'S N': 1, 'S D': 0, 'S C': 0, 'S Q': -1, 'S E': 0, 'S G': 1, 'S H': -1, 'S I': -1, 'S L': -3, 'S K': 0, 'S M': -2, 'S F': -3, 'S P': 1, 'S S': 2, 'S T': 1, 'S W': -2, 'S Y': -3, 'S V': -1,
    'T A': 1, 'T R': -1, 'T N': 0, 'T D': 0, 'T C': -2, 'T Q': -1, 'T E': 0, 'T G': 0, 'T H': -1, 'T I': 0, 'T L': -2, 'T K': 0, 'T M': -1, 'T F': -3, 'T P': 0, 'T S': 1, 'T T': 3, 'T W': -5, 'T Y': -3, 'T V': 0,
    'W A': -6, 'W R': 2, 'W N': -4, 'W D': -7, 'W C': -8, 'W Q': -5, 'W E': -7, 'W G': -7, 'W H': -3, 'W I': -5, 'W L': -2, 'W K': -3, 'W M': -4, 'W F': 0, 'W P': -6, 'W S': -2, 'W T': -5, 'W W': 17, 'W Y': 0, 'W V': -6,
    'Y A': -3, 'Y R': -4, 'Y N': -2, 'Y D': -4, 'Y C': 0, 'Y Q': -4, 'Y E': -4, 'Y G': -5, 'Y H': 0, 'Y I': -1, 'Y L': -1, 'Y K': -4, 'Y M': -2, 'Y F': 7, 'Y P': -5, 'Y S': -3, 'Y T': -3, 'Y W': 0, 'Y Y': 10, 'Y V': -2,
    'V A': 0, 'V R': -2, 'V N': -2, 'V D': -2, 'V C': -2, 'V Q': -2, 'V E': -2, 'V G': -1, 'V H': -2, 'V I': 4, 'V L': 2, 'V K': -2, 'V M': 2, 'V F': -1, 'V P': -1, 'V S': -1, 'V T': 0, 'V W': -6, 'V Y': -2, 'V V': 4,
  }
  const m: Record<string, Record<string, number>> = {}
  const aminos = ['A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V']
  for (const a of aminos) {
    m[a] = {}
    for (const b of aminos) {
      m[a][b] = PAM250_DATA[`${a} ${b}`] ?? -8
    }
  }
  return m
}

export const SCORING_MATRICES = {
  simple: { name: 'Simple (DNA)', matrix: simpleMatrix(2, -1), gapPenalty: -2 },
  blosum62: { name: 'BLOSUM62', matrix: buildBlosum62(), gapPenalty: -10 },
  pam250: { name: 'PAM250', matrix: buildPam250(), gapPenalty: -10 },
}
