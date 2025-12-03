import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Task, FilterType, TaskStats as TaskStatsType } from '../types';
import { getAllTasks, toggleTaskCompletion, deleteTask, getTaskStats } from '../services/db';
import { getUsername } from '../services/settings';
import { TaskItem, TaskStats, FilterTabs, EmptyState } from '../components';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Home screen displaying the task list with filtering and statistics.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStatsType>({ total: 0, completed: 0, active: 0 });
  const [filter, setFilter] = useState<FilterType>('all');
  const [username, setUsername] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [fetchedTasks, fetchedStats, storedUsername] = await Promise.all([
        getAllTasks(),
        getTaskStats(),
        getUsername(),
      ]);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
      setUsername(storedUsername);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleTaskCompletion(id);
      await loadData();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return { title: 'No Active Tasks', message: 'All your tasks are completed! Great job!' };
      case 'completed':
        return { title: 'No Completed Tasks', message: 'Complete some tasks to see them here.' };
      default:
        return { title: 'No Tasks Yet', message: 'Tap the + button to create your first task.' };
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
        <Text style={{ fontSize: 18, color: isDark ? '#9ca3af' : '#4b5563' }}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.flex1, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#60a5fa' : '#3b82f6'}
          />
        }
      >
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#ffffff' : '#111827' }}>
            {username ? `Hello, ${username}!` : 'Welcome!'}
          </Text>
          <Text style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
            {stats.active > 0
              ? `You have ${stats.active} task${stats.active !== 1 ? 's' : ''} to complete`
              : 'All caught up!'}
          </Text>
        </View>

        {stats.total > 0 && <TaskStats stats={stats} />}
        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <EmptyState {...getEmptyMessage()} />
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/add-task')}
        style={[styles.fab, styles.fabRight, { backgroundColor: '#3b82f6' }]}
      >
        <Text style={{ color: '#ffffff', fontSize: 30, fontWeight: '300' }}>+</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/settings')}
        style={[styles.fab, styles.fabLeft, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}
      >
        <Text style={{ fontSize: 24 }}>⚙️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabRight: { right: 24 },
  fabLeft: { left: 24 },
});
