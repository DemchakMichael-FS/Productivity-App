import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  message: string;
}

/**
 * EmptyState component displays a message when there are no tasks to show.
 */
export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-6xl mb-4">📋</Text>
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center px-8">
        {message}
      </Text>
    </View>
  );
}

export default EmptyState;
