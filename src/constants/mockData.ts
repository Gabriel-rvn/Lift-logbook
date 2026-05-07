import { UserSummary } from '../types';

export const MOCK_USER: UserSummary = {
  name: 'Gabriel',
  rank: 'Challenger',
  totalScore: 600,
  prs: [
    { exercise: 'Squat', weight: 220, date: '2026-04-20T00:00:00Z' },
    { exercise: 'Bench', weight: 160, date: '2026-04-15T00:00:00Z' },
    { exercise: 'Deadlift', weight: 280, date: '2026-04-28T00:00:00Z' },
  ],
};

//não está mais sendo usado