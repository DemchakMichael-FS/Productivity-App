import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
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

  // Load tasks and stats
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

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // Toggle task completion
  const handleToggleComplete = async (id: number) => {
    try {
      await toggleTaskCompletion(id);
      await loadData();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  // Delete task
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Filter tasks based on selected filter
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

  // Get empty state message based on filter
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
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-lg text-gray-600 dark:text-gray-400">Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#60a5fa' : '#3b82f6'}
          />
        }
      >
        {/* Welcome Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {username ? `Hello, ${username}!` : 'Welcome!'}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            {stats.active > 0
              ? `You have ${stats.active} task${stats.active !== 1 ? 's' : ''} to complete`
              : 'All caught up!'}
          </Text>
        </View>

        {/* Task Statistics */}
        {stats.total > 0 && <TaskStats stats={stats} />}

        {/* Filter Tabs */}
        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

        {/* Task List */}
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

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push('/add-task')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg active:bg-primary-600"
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </Pressable>

      {/* Settings Button */}
      <Pressable
        onPress={() => router.push('/settings')}
        className="absolute bottom-6 left-6 w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center shadow-md active:bg-gray-300 dark:active:bg-gray-600"
      >
        <Text className="text-2xl">⚙️</Text>
      </Pressable>
    </View>
  );
}
