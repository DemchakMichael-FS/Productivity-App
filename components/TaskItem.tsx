import React from 'react';
import { View, Text, Pressable, Alert, Platform, StyleSheet } from 'react-native';
import { Task } from '../types';
import { PRIORITY_LABELS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_STYLES = {
  high: { border: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
  medium: { border: '#f59e0b', bg: '#fffbeb', text: '#d97706' },
  low: { border: '#22c55e', bg: '#f0fdf4', text: '#16a34a' },
};

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const { isDark } = useTheme();
  const priority = PRIORITY_STYLES[task.priority];

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
        onDelete(task.id);
      }
    } else {
      Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ]);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#ffffff', borderLeftColor: priority.border }]}>
      <View style={styles.row}>
        <Pressable onPress={() => onToggleComplete(task.id)} style={styles.content}>
          <View style={[styles.checkbox, task.completed ? styles.checkboxChecked : { borderColor: isDark ? '#4b5563' : '#d1d5db' }]}>
            {task.completed && <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, task.completed && styles.completed, { color: task.completed ? '#9ca3af' : (isDark ? '#ffffff' : '#111827') }]}>{task.title}</Text>
            {task.description ? <Text style={[styles.desc, { color: task.completed ? '#9ca3af' : (isDark ? '#9ca3af' : '#4b5563') }]} numberOfLines={2}>{task.description}</Text> : null}
            <View style={[styles.badge, { backgroundColor: isDark ? `${priority.border}20` : priority.bg }]}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: priority.text }}>{PRIORITY_LABELS[task.priority]}</Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={{ color: '#ef4444', fontSize: 18 }}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  content: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  completed: { textDecorationLine: 'line-through' },
  desc: { fontSize: 14, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  deleteBtn: { padding: 8 },
});

export default TaskItem;
