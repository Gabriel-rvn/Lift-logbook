// ─── Exercícios ──────────────────────────────────────────────
export type ExerciseType = 'Squat' | 'Bench' | 'Deadlift';

// ─── Ranks (inspirado nos tiers do League of Legends) ────────
export type UserRank =
  | 'Iron'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Master'
  | 'Grandmaster'
  | 'Challenger';

// ─── Registro de PR (como vem do banco) ─────────────────────
export interface PRRecordRow {
  id: string;
  user_id: string;
  exercise: ExerciseType;
  weight: number;
  created_at: string; // ISO-8601 do Supabase
}

// ─── Input para criar um novo PR ─────────────────────────────
export interface PRInput {
  exercise: ExerciseType;
  weight: number;
}

// ─── PR mais alto de cada exercício (para o dashboard) ───────
export interface PRRecord {
  /** Tipo do exercício */
  exercise: ExerciseType;
  /** Peso em kg */
  weight: number;
  /** Data em que o PR foi alcançado */
  date: string; // ISO-8601
}

// ─── Resumo do usuário ───────────────────────────────────────
export interface UserSummary {
  /** Nome do atleta */
  name: string;
  /** Rank atual baseado na pontuação total */
  rank: UserRank;
  /** Pontuação total (soma dos 3 PRs) */
  totalScore: number;
  /** Registros de PR para cada exercício */
  prs: PRRecord[];
}

// ─── Faixas de Rank (placeholder — será substituído por DOTS) ─
export const RANK_THRESHOLDS: { min: number; rank: UserRank }[] = [
  { min: 900, rank: 'Challenger' },
  { min: 800, rank: 'Grandmaster' },
  { min: 700, rank: 'Master' },
  { min: 600, rank: 'Diamond' },
  { min: 500, rank: 'Platinum' },
  { min: 400, rank: 'Gold' },
  { min: 300, rank: 'Silver' },
  { min: 200, rank: 'Bronze' },
  { min: 0, rank: 'Iron' },
];

/** Calcula o rank baseado na pontuação total (placeholder — será DOTS futuramente) */
export function getRankFromScore(totalScore: number): UserRank {
  for (const tier of RANK_THRESHOLDS) {
    if (totalScore >= tier.min) {
      return tier.rank;
    }
  }
  return 'Iron';
}
