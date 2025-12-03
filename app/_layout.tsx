import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { initDatabase } from '../services/db';

/**
 * Inner layout component that uses the theme context.
 */
function InnerLayout() {
  const { isDark } = useTheme();

  return (
    <View style={[styles.flex1, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
          },
          headerTintColor: isDark ? '#ffffff' : '#111827',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: isDark ? '#111827' : '#f9fafb',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'My Tasks',
          }}
        />
        <Stack.Screen
          name="add-task"
          options={{
            title: 'Add Task',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      </Stack>
    </View>
  );
}

/**
 * Loading component shown while initializing.
 */
function LoadingScreen() {
  const { isDark } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <Text style={{ fontSize: 18, color: isDark ? '#9ca3af' : '#4b5563' }}>Loading...</Text>
    </View>
  );
}

/**
 * Error component shown when initialization fails.
 */
function ErrorScreen({ message }: { message: string }) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.centered, { backgroundColor: isDark ? '#111827' : '#f9fafb', padding: 16 }]}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#ffffff' : '#111827', marginBottom: 8 }}>
        Initialization Error
      </Text>
      <Text style={{ color: isDark ? '#9ca3af' : '#4b5563', textAlign: 'center' }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

/**
 * Root layout component that initializes the database and theme.
 */
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        await initDatabase();
        setIsReady(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      }
    }
    initialize();
  }, []);

  if (error) {
    return (
      <ThemeProvider>
        <ErrorScreen message={error} />
      </ThemeProvider>
    );
  }

  if (!isReady) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
