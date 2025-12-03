import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Priority } from '../types';
import { createTask } from '../services/db';
import { PrioritySelector } from '../components';
import { useTheme } from '../contexts/ThemeContext';

export default function AddTaskScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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
      await createTask({ title: title.trim(), description: description.trim(), priority });
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.flex1, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}
    >
      <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.label, { color: isDark ? '#d1d5db' : '#374151' }]}>
            Title <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }]}
            maxLength={100}
            autoFocus
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.label, { color: isDark ? '#d1d5db' : '#374151' }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description (optional)"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }]}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
        </View>

        <PrioritySelector selectedPriority={priority} onPriorityChange={setPriority} />

        <View style={styles.buttonRow}>
          <Pressable onPress={() => router.back()} style={[styles.button, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
            <Text style={[styles.buttonText, { color: isDark ? '#d1d5db' : '#374151' }]}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleSubmit} disabled={isSubmitting} style={[styles.button, { backgroundColor: isSubmitting ? '#60a5fa' : '#3b82f6' }]}>
            <Text style={[styles.buttonText, { color: '#ffffff' }]}>{isSubmitting ? 'Creating...' : 'Create Task'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  textArea: { minHeight: 100 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  button: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontWeight: '600', fontSize: 16 },
});
