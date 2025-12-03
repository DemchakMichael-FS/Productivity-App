import React from 'react';
import { View, Text } from 'react-native';
import { TaskStats as TaskStatsType } from '../types';

interface TaskStatsProps {
  stats: TaskStatsType;
}

/**
 * TaskStats component displays task statistics including
 * total, completed, and active task counts.
 */
export function TaskStats({ stats }: TaskStatsProps) {
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        Task Statistics
      </Text>
      
      {/* Progress Bar */}
      <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
        <View 
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </View>
      
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
        {completionPercentage}% Complete
      </Text>

      {/* Stats Grid */}
      <View className="flex-row justify-around">
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Total</Text>
        </View>
        
        <View className="w-px bg-gray-200 dark:bg-gray-700" />
        
        <View className="items-center">
          <Text className="text-2xl font-bold text-green-500">
            {stats.completed}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Completed</Text>
        </View>
        
        <View className="w-px bg-gray-200 dark:bg-gray-700" />
        
        <View className="items-center">
          <Text className="text-2xl font-bold text-amber-500">
            {stats.active}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Active</Text>
        </View>
      </View>
    </View>
  );
}

export default TaskStats;
