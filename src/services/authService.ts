import { supabase } from '../lib/supabase';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

// ─── Sign Up ─────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null }> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
}

// ─── Sign In ─────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
}

// ─── Sign Out ────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// ─── Get Current Session ─────────────────────────────────────
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

// ─── Get Current User ────────────────────────────────────────
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

// ─── Auth State Listener ─────────────────────────────────────
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
