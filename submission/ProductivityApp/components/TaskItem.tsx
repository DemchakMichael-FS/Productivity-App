import React from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { Task } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../constants';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * TaskItem component displays a single task with priority indicator,
 * completion toggle, and delete functionality.
 */
export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const priorityColors = PRIORITY_COLORS[task.priority];

  const handleDelete = () => {
    // Use confirm for web, Alert for native
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
        onDelete(task.id);
      }
    } else {
      Alert.alert(
        'Delete Task',
        `Are you sure you want to delete "${task.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
        ]
      );
    }
  };

  return (
    <View className={`bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow-sm border-l-4 ${priorityColors.border}`}>
      <View className="flex-row items-start justify-between">
        {/* Checkbox and Content */}
        <Pressable
          onPress={() => onToggleComplete(task.id)}
          className="flex-row items-start flex-1 mr-3"
        >
          {/* Custom Checkbox */}
          <View
            className={`w-6 h-6 rounded-full border-2 mr-3 mt-0.5 items-center justify-center ${
              task.completed
                ? 'bg-primary-500 border-primary-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {task.completed && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </View>

          {/* Task Content */}
          <View className="flex-1">
            <Text
              className={`text-base font-semibold mb-1 ${
                task.completed
                  ? 'text-gray-400 dark:text-gray-500 line-through'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text
                className={`text-sm mb-2 ${
                  task.completed
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            ) : null}

            {/* Priority Badge */}
            <View className={`self-start px-2 py-1 rounded-full ${priorityColors.bgLight}`}>
              <Text className={`text-xs font-medium ${priorityColors.text}`}>
                {PRIORITY_LABELS[task.priority]}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Delete Button */}
        <Pressable
          onPress={handleDelete}
          className="p-2 rounded-full active:bg-red-100 dark:active:bg-red-900/30"
        >
          <Text className="text-red-500 text-lg">✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default TaskItem;
