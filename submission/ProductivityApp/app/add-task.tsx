import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Priority } from '../types';
import { createTask } from '../services/db';
import { PrioritySelector } from '../components';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Add Task screen for creating new tasks.
 */
export default function AddTaskScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate title
    if (!title.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a task title');
      } else {
        Alert.alert('Validation Error', 'Please enter a task title');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      router.back();
    } catch (error) {
      console.error('Failed to create task:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to create task. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to create task. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
            maxLength={100}
            autoFocus
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description (optional)"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
          />
        </View>

        {/* Priority Selector */}
        <PrioritySelector selectedPriority={priority} onPriorityChange={setPriority} />

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-6">
          <Pressable
            onPress={handleCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-700 py-4 rounded-xl active:bg-gray-300 dark:active:bg-gray-600"
          >
            <Text className="text-center text-gray-700 dark:text-gray-300 font-semibold text-base">
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-4 rounded-xl ${
              isSubmitting
                ? 'bg-primary-400'
                : 'bg-primary-500 active:bg-primary-600'
            }`}
          >
            <Text className="text-center text-white font-semibold text-base">
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
