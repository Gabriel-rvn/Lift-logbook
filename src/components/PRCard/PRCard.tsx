import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ExerciseType } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, EXERCISE_LABELS } from '../../constants/theme';

interface PRCardProps {
  exercise: ExerciseType;
  weight: number;
}

export const PRCard: React.FC<PRCardProps> = ({ exercise, weight }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const { label, emoji } = EXERCISE_LABELS[exercise];

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Borda dourada sutil no topo */}
      <View style={styles.topAccent} />

      <View style={styles.content}>
        {/* Lado esquerdo: emoji + nome */}
        <View style={styles.left}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View>
            <Text style={styles.exerciseLabel}>{label}</Text>
            <Text style={styles.exerciseType}>{exercise.toUpperCase()}</Text>
          </View>
        </View>

        {/* Lado direito: peso */}
        <View style={styles.right}>
          <Text style={styles.weight}>{weight}</Text>
          <Text style={styles.unit}>KG</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topAccent: {
    height: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  emoji: {
    fontSize: FONTS.sizeXl,
  },
  exerciseLabel: {
    fontSize: FONTS.sizeMd,
    fontWeight: FONTS.weightSemiBold,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  exerciseType: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightMedium,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  weight: {
    fontSize: FONTS.size2xl,
    fontWeight: FONTS.weightBlack,
    color: COLORS.accentLight,
    letterSpacing: -1,
  },
  unit: {
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
});
