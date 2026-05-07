import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToLogin,
}) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signUp(email.trim(), password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar conta.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Logo ────────────────────────────── */}
          <View style={styles.logoContainer}>
            <View style={styles.logoRow}>
              <Text style={styles.logoText}>LIFT</Text>
              <Text style={[styles.logoText, styles.logoAccent]}>RANK</Text>
            </View>
            <Text style={styles.tagline}>Crie sua conta e comece a evoluir.</Text>
          </View>

          {/* ─── Form ────────────────────────────── */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Criar Conta</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repita a senha"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <Text style={styles.buttonText}>CRIAR CONTA</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ─── Footer link ─────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={onNavigateToLogin} disabled={loading}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },

  // ─── Logo ──────────────────────────
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontSize: FONTS.size3xl,
    fontWeight: FONTS.weightBlack,
    color: COLORS.textPrimary,
    letterSpacing: 6,
  },
  logoAccent: {
    color: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  tagline: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
    letterSpacing: 1,
  },

  // ─── Form ──────────────────────────
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: FONTS.sizeXl,
    fontWeight: FONTS.weightBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },

  // ─── Error ─────────────────────────
  errorBox: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONTS.sizeSm,
    textAlign: 'center',
  },

  // ─── Inputs ────────────────────────
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizeMd,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ─── Button ────────────────────────
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    minHeight: 52,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: FONTS.sizeMd,
    fontWeight: FONTS.weightBlack,
    color: COLORS.background,
    letterSpacing: 3,
  },

  // ─── Footer ────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: FONTS.sizeSm,
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },
});
