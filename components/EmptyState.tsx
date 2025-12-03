import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const { isDark } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📋</Text>
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>{title}</Text>
      <Text style={[styles.message, { color: isDark ? '#9ca3af' : '#4b5563' }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  message: { textAlign: 'center', paddingHorizontal: 32 },
});

export default EmptyState;
