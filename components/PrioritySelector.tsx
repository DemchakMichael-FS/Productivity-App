import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Priority } from '../types';
import { PRIORITY_LABELS } from '../constants';

interface PrioritySelectorProps {
  selectedPriority: Priority;
  onPriorityChange: (priority: Priority) => void;
}

// Color values for each priority
const PRIORITY_STYLES = {
  high: {
    color: '#ef4444',
    bgColor: '#ef4444',
  },
  medium: {
    color: '#f59e0b',
    bgColor: '#f59e0b',
  },
  low: {
    color: '#22c55e',
    bgColor: '#22c55e',
  },
};

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

/**
 * PrioritySelector component provides buttons to select task priority.
 */
export function PrioritySelector({ selectedPriority, onPriorityChange }: PrioritySelectorProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Priority
      </Text>
      <View style={styles.container}>
        {PRIORITIES.map((priority) => {
          const priorityStyle = PRIORITY_STYLES[priority];
          const isSelected = selectedPriority === priority;
          
          return (
            <Pressable
              key={priority}
              onPress={() => onPriorityChange(priority)}
              style={[
                styles.button,
                isSelected
                  ? { backgroundColor: priorityStyle.bgColor, borderColor: priorityStyle.bgColor }
                  : { backgroundColor: 'transparent', borderColor: priorityStyle.color }
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: isSelected ? '#ffffff' : priorityStyle.color }
                ]}
              >
                {PRIORITY_LABELS[priority]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PrioritySelector;
