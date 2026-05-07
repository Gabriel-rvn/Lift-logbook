import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { PRRecordRow } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, EXERCISE_LABELS } from '../../constants/theme';

interface ProgressTableProps {
  records: PRRecordRow[];
  loading?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const ProgressTable: React.FC<ProgressTableProps> = ({ records, loading }) => {
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Carregando histórico...</Text>
      </View>
    );
  }

  if (records.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyText}>Nenhum registro ainda.</Text>
        <Text style={styles.emptySubtext}>Toque no "+" para registrar seu primeiro PR!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ─── Header da tabela ─────────────── */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.cellDate]}>DATA</Text>
        <Text style={[styles.headerCell, styles.cellExercise]}>EXERCÍCIO</Text>
        <Text style={[styles.headerCell, styles.cellWeight]}>PESO</Text>
      </View>

      {/* ─── Linhas ──────────────────────── */}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          const { emoji, label } = EXERCISE_LABELS[item.exercise];
          const isEven = index % 2 === 0;

          return (
            <View style={[styles.row, isEven && styles.rowEven]}>
              <Text style={[styles.cell, styles.cellDate, styles.cellDateText]}>
                {formatDate(item.created_at)}
              </Text>
              <View style={[styles.cellExercise, styles.exerciseCell]}>
                <Text style={styles.exerciseCellEmoji}>{emoji}</Text>
                <Text style={styles.cell}>{label}</Text>
              </View>
              <Text style={[styles.cell, styles.cellWeight, styles.weightText]}>
                {item.weight} <Text style={styles.weightUnit}>kg</Text>
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ─── Header ──────────────────────
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceHighlight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  headerCell: {
    fontSize: FONTS.sizeXs,
    fontWeight: FONTS.weightBold,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },

  // ─── Row ─────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  rowEven: {
    backgroundColor: COLORS.surfaceLight,
  },

  // ─── Cells ───────────────────────
  cell: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weightMedium,
  },
  cellDate: {
    flex: 3,
  },
  cellDateText: {
    color: COLORS.textSecondary,
  },
  cellExercise: {
    flex: 4,
  },
  cellWeight: {
    flex: 2,
    textAlign: 'right',
  },

  // ─── Exercise cell ───────────────
  exerciseCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  exerciseCellEmoji: {
    fontSize: 14,
  },

  // ─── Weight ──────────────────────
  weightText: {
    color: COLORS.accentLight,
    fontWeight: FONTS.weightBold,
  },
  weightUnit: {
    fontSize: FONTS.sizeXs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weightMedium,
  },

  // ─── Empty ───────────────────────
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizeMd,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weightMedium,
  },
  emptySubtext: {
    fontSize: FONTS.sizeSm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
