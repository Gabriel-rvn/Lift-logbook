import { UserRank } from '../types';

// ─── Paleta de cores principal ───────────────────────────────
export const COLORS = {
  // Fundos
  background: '#0A0A0F',
  surface: '#16161E',
  surfaceLight: '#1E1E2A',
  surfaceHighlight: '#252535',

  // Textos
  textPrimary: '#F0F0F5',
  textSecondary: '#8A8A9A',
  textMuted: '#5A5A6A',

  // Destaque dourado (estilo Sentinelas / LoL)
  accent: '#D4A843',
  accentLight: '#F0D060',
  accentDim: '#9A7B30',
  accentGlow: 'rgba(212, 168, 67, 0.25)',

  // Borda / divisores
  border: '#2A2A3A',
  borderLight: '#3A3A4A',

  // Feedback
  success: '#4ADE80',
  danger: '#F87171',
} as const;

// ─── Tipografia ──────────────────────────────────────────────
export const FONTS = {
  sizeXs: 11,
  sizeSm: 13,
  sizeMd: 16,
  sizeLg: 20,
  sizeXl: 28,
  size2xl: 36,
  size3xl: 48,

  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemiBold: '600' as const,
  weightBold: '700' as const,
  weightBlack: '900' as const,
};

// ─── Espaçamento ─────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Bordas ──────────────────────────────────────────────────
export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
};

// ─── Cores por Rank ──────────────────────────────────────────
export const RANK_COLORS: Record<UserRank, { primary: string; glow: string }> = {
  Iron:        { primary: '#6B6B6B', glow: 'rgba(107, 107, 107, 0.30)' },
  Bronze:      { primary: '#A0622E', glow: 'rgba(160,  98,  46, 0.30)' },
  Silver:      { primary: '#B0B0C0', glow: 'rgba(176, 176, 192, 0.30)' },
  Gold:        { primary: '#D4A843', glow: 'rgba(212, 168,  67, 0.30)' },
  Platinum:    { primary: '#4FC1A6', glow: 'rgba( 79, 193, 166, 0.30)' },
  Diamond:     { primary: '#6EC1E4', glow: 'rgba(110, 193, 228, 0.30)' },
  Master:      { primary: '#9B59B6', glow: 'rgba(155,  89, 182, 0.30)' },
  Grandmaster: { primary: '#E74C3C', glow: 'rgba(231,  76,  60, 0.30)' },
  Challenger:  { primary: '#F1C40F', glow: 'rgba(241, 196,  15, 0.40)' },
};

// ─── Labels dos exercícios ───────────────────────────────────
export const EXERCISE_LABELS = {
  Squat: { label: 'Agachamento', emoji: '🦵' },
  Bench: { label: 'Supino', emoji: '🏋️' },
  Deadlift: { label: 'Terra', emoji: '💀' },
} as const;
