import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { UserRank } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, RANK_COLORS } from '../../constants/theme';

interface RankBadgeProps {
  rank: UserRank;
  size?: 'small' | 'large';
}

const RANK_ICONS: Record<UserRank, string> = {
  Iron: '⚙️',
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Diamond: '💠',
  Master: '👑',
  Grandmaster: '🔱',
  Challenger: '⚡',
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'large' }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  const isLarge = size === 'large';
  const rankColor = RANK_COLORS[rank];

  useEffect(() => {
    // Animação de entrada com bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // Animação de glow pulsante
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Glow externo */}
      <Animated.View
        style={[
          styles.glowRing,
          isLarge ? styles.glowRingLarge : styles.glowRingSmall,
          {
            backgroundColor: rankColor.glow,
            borderColor: rankColor.primary,
            opacity: glowAnim,
          },
        ]}
      />

      {/* Badge principal */}
      <View
        style={[
          styles.badge,
          isLarge ? styles.badgeLarge : styles.badgeSmall,
          {
            borderColor: rankColor.primary,
            shadowColor: rankColor.primary,
          },
        ]}
      >
        <Text style={[styles.icon, isLarge ? styles.iconLarge : styles.iconSmall]}>
          {RANK_ICONS[rank]}
        </Text>
      </View>

      {/* Label do rank */}
      <Text
        style={[
          styles.rankLabel,
          isLarge ? styles.rankLabelLarge : styles.rankLabelSmall,
          { color: rankColor.primary },
        ]}
      >
        {rank.toUpperCase()}
      </Text>

      {/* Subtítulo decorativo */}
      {isLarge && (
        <Text style={styles.subtitle}>CURRENT TIER</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },

  // ─── Glow Ring ───────────────────────
  glowRing: {
    position: 'absolute',
    borderRadius: RADIUS.full,
    borderWidth: 2,
  },
  glowRingLarge: {
    width: 160,
    height: 160,
  },
  glowRingSmall: {
    width: 80,
    height: 80,
  },

  // ─── Badge ───────────────────────────
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 2.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  badgeLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  badgeSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  // ─── Icon ────────────────────────────
  icon: {},
  iconLarge: {
    fontSize: 48,
  },
  iconSmall: {
    fontSize: 24,
  },

  // ─── Labels ──────────────────────────
  rankLabel: {
    fontWeight: FONTS.weightBlack,
    letterSpacing: 4,
    marginTop: SPACING.md,
  },
  rankLabelLarge: {
    fontSize: FONTS.sizeXl,
  },
  rankLabelSmall: {
    fontSize: FONTS.sizeSm,
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightMedium,
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginTop: SPACING.xs,
  },
});
