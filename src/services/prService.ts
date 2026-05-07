import { supabase } from '../lib/supabase';
import { ExerciseType, PRRecordRow, PRRecord } from '../types';

// ─── Inserir novo PR ─────────────────────────────────────────
export async function insertPR(
  exercise: ExerciseType,
  weight: number,
  userId: string
): Promise<PRRecordRow> {
  const { data, error } = await supabase
    .from('pr_records')
    .insert({ exercise, weight, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as PRRecordRow;
}

// ─── Buscar todo o histórico (para tabela de progresso) ──────
export async function fetchAllPRs(): Promise<PRRecordRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('pr_records')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PRRecordRow[];
}

// ─── Buscar PR mais alto de cada exercício (para dashboard) ──
export async function fetchLatestPRs(): Promise<PRRecord[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const exercises: ExerciseType[] = ['Squat', 'Bench', 'Deadlift'];
  const results: PRRecord[] = [];

  for (const exercise of exercises) {
    const { data, error } = await supabase
      .from('pr_records')
      .select('*')
      .eq('exercise', exercise)
      .eq('user_id', user.id)
      .order('weight', { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);

    if (data && data.length > 0) {
      const row = data[0] as PRRecordRow;
      results.push({
        exercise: row.exercise,
        weight: row.weight,
        date: row.created_at,
      });
    }
  }

  return results;
}

// ─── Deletar um registro ─────────────────────────────────────
export async function deletePR(id: string): Promise<void> {
  const { error } = await supabase
    .from('pr_records')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
