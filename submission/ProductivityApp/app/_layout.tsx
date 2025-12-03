import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { initDatabase } from '../services/db';
import '../global.css';

/**
 * Inner layout component that uses the theme context.
 */
function InnerLayout() {
  const { isDark } = useTheme();

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
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
              headerLargeTitle: true,
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
    </View>
  );
}

/**
 * Loading component shown while initializing.
 */
function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Text className="text-lg text-gray-600 dark:text-gray-400">Loading...</Text>
    </View>
  );
}

/**
 * Error component shown when initialization fails.
 */
function ErrorScreen({ message }: { message: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Initialization Error
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center">{message}</Text>
    </View>
  );
}

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
