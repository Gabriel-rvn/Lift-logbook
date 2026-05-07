import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { PRCard, RankBadge, AddPRModal, ProgressTable } from '../components';
import { COLORS, FONTS, SPACING, RADIUS, RANK_COLORS } from '../constants/theme';
import { ExerciseType, PRRecord, PRRecordRow, getRankFromScore } from '../types';
import { fetchLatestPRs, fetchAllPRs } from '../services/prService';
import { useAuth } from '../contexts/AuthContext';

export const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  // ─── State ─────────────────────────────────────────────
  const [prs, setPrs] = useState<PRRecord[]>([]);
  const [allRecords, setAllRecords] = useState<PRRecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ─── Animações ─────────────────────────────────────────
  const headerFade = useRef(new Animated.Value(0)).current;
  const scoreFade = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(0.8)).current;

  // ─── Dados calculados ──────────────────────────────────
  const totalScore = prs.reduce((sum, pr) => sum + pr.weight, 0);
  const rank = getRankFromScore(totalScore);
  const rankColor = RANK_COLORS[rank];

  // ─── Fetch dados ───────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [latestPRs, history] = await Promise.all([
        fetchLatestPRs(),
        fetchAllPRs(),
      ]);
      setPrs(latestPRs);
      setAllRecords(history);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Animações de entrada ──────────────────────────────
  useEffect(() => {
    if (!loading) {
      Animated.sequence([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(scoreFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scoreScale, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [loading]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handlePRSuccess = useCallback(() => {
    loadData();
  }, [loadData]);

  // ─── Loading state ─────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Carregando seus PRs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft} />
            <View style={styles.logoRow}>
              <Text style={styles.appTitle}>LIFT</Text>
              <Text style={[styles.appTitle, styles.appTitleAccent]}>RANK</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={signOut}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.greeting, { opacity: headerFade }]}>
          <Text style={styles.greetingText}>
            Olá, <Text style={styles.greetingName}>{user?.email?.split('@')[0] ?? 'Atleta'}</Text>
          </Text>
        </Animated.View>

        {/* ─── Divider ───────────────────────────────── */}
        <View style={styles.divider} />

        {/* ─── Rank Badge ────────────────────────────── */}
        <View style={styles.rankSection}>
          <RankBadge rank={rank} size="large" />
        </View>

        {/* ─── Total Score ───────────────────────────── */}
        <Animated.View
          style={[
            styles.scoreContainer,
            {
              opacity: scoreFade,
              transform: [{ scale: scoreScale }],
            },
          ]}
        >
          <View
            style={[
              styles.scoreCard,
              { borderColor: rankColor.primary, shadowColor: rankColor.primary },
            ]}
          >
            <Text style={styles.scoreLabel}>TOTAL</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreValue, { color: rankColor.primary }]}>
                {totalScore}
              </Text>
              <Text style={styles.scoreUnit}>KG</Text>
            </View>
            <Text style={styles.scoreSubtitle}>SBD COMBINED</Text>
          </View>
        </Animated.View>

        {/* ─── Divider ───────────────────────────────── */}
        <View style={styles.divider} />

        {/* ─── PR Cards Section ──────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏆  PERSONAL RECORDS</Text>
        </View>

        <View style={styles.cardsContainer}>
          {prs.length > 0 ? (
            prs.map((pr) => (
              <PRCard
                key={pr.exercise}
                exercise={pr.exercise as ExerciseType}
                weight={pr.weight}
              />
            ))
          ) : (
            <View style={styles.emptyPrs}>
              <Text style={styles.emptyPrsText}>
                Nenhum PR registrado ainda. Toque no "+" para começar!
              </Text>
            </View>
          )}
        </View>

        {/* ─── Divider ───────────────────────────────── */}
        <View style={styles.divider} />

        {/* ─── Progress Table ────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📊  HISTÓRICO DE PROGRESSO</Text>
        </View>

        <ProgressTable records={allRecords} />

        {/* ─── Footer ────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ⚔️ Quebre seus limites. Suba de rank.
          </Text>
        </View>
      </ScrollView>

      {/* ─── FAB: Add PR ─────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* ─── Modal ───────────────────────────────────── */}
      <AddPRModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handlePRSuccess}
        userId={user?.id ?? ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizeMd,
    marginTop: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },

  // ─── Header ─────────────────────────────
  header: {
    marginBottom: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 50,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  appTitle: {
    fontSize: FONTS.size3xl,
    fontWeight: FONTS.weightBlack,
    color: COLORS.textPrimary,
    letterSpacing: 6,
  },
  appTitleAccent: {
    color: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  logoutBtn: {
    width: 50,
    alignItems: 'flex-end',
    paddingVertical: SPACING.xs,
  },
  logoutText: {
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightBold,
    color: COLORS.danger,
    letterSpacing: 1,
  },
  greeting: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greetingText: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textSecondary,
  },
  greetingName: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightBold,
  },

  // ─── Divider ────────────────────────────
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
    opacity: 0.5,
  },

  // ─── Rank Section ───────────────────────
  rankSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  // ─── Score ──────────────────────────────
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  scoreLabel: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: FONTS.weightBlack,
    letterSpacing: -2,
  },
  scoreUnit: {
    fontSize: FONTS.sizeLg,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  scoreSubtitle: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightMedium,
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginTop: SPACING.xs,
  },

  // ─── Section Header ────────────────────
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizeSm,
    fontWeight: FONTS.weightBold,
    color: COLORS.textSecondary,
    letterSpacing: 3,
  },

  // ─── Cards ─────────────────────────────
  cardsContainer: {
    marginBottom: SPACING.lg,
  },

  // ─── Empty PRs ─────────────────────────
  emptyPrs: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyPrsText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizeMd,
    textAlign: 'center',
  },

  // ─── Footer ────────────────────────────
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weightMedium,
    letterSpacing: 1,
    fontStyle: 'italic',
  },

  // ─── FAB ───────────────────────────────
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: {
    fontSize: 32,
    fontWeight: FONTS.weightBlack,
    color: COLORS.background,
    lineHeight: 34,
  },
});
