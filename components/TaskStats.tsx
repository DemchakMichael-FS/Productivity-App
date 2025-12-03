import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStats as TaskStatsType } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  const { isDark } = useTheme();
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>Task Statistics</Text>
      <View style={[styles.progressBg, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
        <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
      </View>
      <Text style={[styles.percent, { color: isDark ? '#9ca3af' : '#4b5563' }]}>{completionPercentage}% Complete</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: isDark ? '#ffffff' : '#111827' }]}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: '#22c55e' }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: '#f59e0b' }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  progressBg: { height: 12, borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 6 },
  percent: { fontSize: 14, textAlign: 'center', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  divider: { width: 1 },
});

export default TaskStats;
