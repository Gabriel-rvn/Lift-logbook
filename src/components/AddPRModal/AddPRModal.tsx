import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ExerciseType } from '../../types';
import { insertPR } from '../../services/prService';
import { COLORS, FONTS, SPACING, RADIUS, EXERCISE_LABELS } from '../../constants/theme';

interface AddPRModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const EXERCISES: ExerciseType[] = ['Squat', 'Bench', 'Deadlift'];

export const AddPRModal: React.FC<AddPRModalProps> = ({ visible, onClose, onSuccess, userId }) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('Squat');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const parsed = parseFloat(weight);
    if (!weight || isNaN(parsed) || parsed <= 0) {
      setError('Informe um peso válido (maior que 0).');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await insertPR(selectedExercise, parsed, userId);
      setSuccess(true);
      setWeight('');
      // Notifica o pai para atualizar os dados
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWeight('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          {/* ─── Header ──────────────────────── */}
          <View style={styles.handle} />
          <Text style={styles.title}>🏋️ REGISTRAR PR</Text>
          <Text style={styles.subtitle}>Registre um novo recorde pessoal</Text>

          {/* ─── Exercise Selector ────────────── */}
          <Text style={styles.label}>EXERCÍCIO</Text>
          <View style={styles.exerciseRow}>
            {EXERCISES.map((ex) => {
              const isActive = ex === selectedExercise;
              const { emoji, label } = EXERCISE_LABELS[ex];
              return (
                <TouchableOpacity
                  key={ex}
                  style={[styles.exerciseBtn, isActive && styles.exerciseBtnActive]}
                  onPress={() => setSelectedExercise(ex)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exerciseEmoji}>{emoji}</Text>
                  <Text
                    style={[styles.exerciseBtnText, isActive && styles.exerciseBtnTextActive]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ─── Weight Input ─────────────────── */}
          <Text style={styles.label}>PESO (KG)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              maxLength={6}
            />
            <Text style={styles.inputUnit}>KG</Text>
          </View>

          {/* ─── Feedback ─────────────────────── */}
          {error && (
            <View style={styles.feedbackError}>
              <Text style={styles.feedbackErrorText}>⚠️ {error}</Text>
            </View>
          )}
          {success && (
            <View style={styles.feedbackSuccess}>
              <Text style={styles.feedbackSuccessText}>✅ PR registrado com sucesso!</Text>
            </View>
          )}

          {/* ─── Actions ─────────────────────── */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.accent,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textMuted,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizeXl,
    fontWeight: FONTS.weightBlack,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },

  // ─── Labels ──────────────────────
  label: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginBottom: SPACING.sm,
  },

  // ─── Exercise Selector ───────────
  exerciseRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  exerciseBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  exerciseBtnActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceHighlight,
  },
  exerciseEmoji: {
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  exerciseBtnText: {
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightSemiBold,
    color: COLORS.textMuted,
  },
  exerciseBtnTextActive: {
    color: COLORS.accent,
  },

  // ─── Input ───────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  input: {
    flex: 1,
    fontSize: FONTS.size2xl,
    fontWeight: FONTS.weightBlack,
    color: COLORS.accentLight,
    paddingVertical: SPACING.md,
    letterSpacing: 1,
  },
  inputUnit: {
    fontSize: FONTS.sizeLg,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },

  // ─── Feedback ────────────────────
  feedbackError: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  feedbackErrorText: {
    color: COLORS.danger,
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightMedium,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  feedbackSuccessText: {
    color: COLORS.success,
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightMedium,
  },

  // ─── Buttons ─────────────────────
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cancelBtnText: {
    fontSize: FONTS.sizeMd,
    fontWeight: FONTS.weightSemiBold,
    color: COLORS.textSecondary,
  },
  submitBtn: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: FONTS.sizeMd,
    fontWeight: FONTS.weightBlack,
    color: COLORS.background,
    letterSpacing: 1,
  },
});
