import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Switch, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getUsername, saveUsername } from '../services/settings';

/**
 * Settings screen for user preferences.
 */
export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved username on mount
  useEffect(() => {
    async function loadUsername() {
      try {
        const stored = await getUsername();
        setUsername(stored);
        setSavedUsername(stored);
      } catch (error) {
        console.error('Failed to load username:', error);
      }
    }
    loadUsername();
  }, []);

  // Save username
  const handleSaveUsername = async () => {
    if (username === savedUsername) {
      setSaveMessage('No changes to save');
      setTimeout(() => setSaveMessage(''), 2000);
      return;
    }

    setIsSaving(true);
    try {
      await saveUsername(username.trim());
      setSavedUsername(username.trim());
      setSaveMessage('Username saved!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Failed to save username:', error);
      setSaveMessage('Failed to save');
      setTimeout(() => setSaveMessage(''), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-4">
        {/* Profile Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Profile
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your name"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
              maxLength={50}
            />
          </View>

          <Pressable
            onPress={handleSaveUsername}
            disabled={isSaving}
            className={`py-3 rounded-xl ${
              isSaving ? 'bg-primary-400' : 'bg-primary-500 active:bg-primary-600'
            }`}
          >
            <Text className="text-center text-white font-semibold">
              {isSaving ? 'Saving...' : 'Save Username'}
            </Text>
          </Pressable>

          {saveMessage ? (
            <Text className="text-center text-sm text-green-500 mt-2">{saveMessage}</Text>
          ) : null}
        </View>

        {/* Appearance Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Appearance
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">{isDark ? '🌙' : '☀️'}</Text>
              <View>
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={Platform.OS === 'ios' ? '#ffffff' : isDark ? '#ffffff' : '#f4f4f5'}
            />
          </View>
        </View>

        {/* About Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            About
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <Text className="text-gray-600 dark:text-gray-400">App Name</Text>
              <Text className="text-gray-900 dark:text-white font-medium">ProductivityApp</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <Text className="text-gray-600 dark:text-gray-400">Version</Text>
              <Text className="text-gray-900 dark:text-white font-medium">1.0.0</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <Text className="text-gray-600 dark:text-gray-400">Platform</Text>
              <Text className="text-gray-900 dark:text-white font-medium">
                {Platform.OS === 'web' ? 'Web' : Platform.OS === 'ios' ? 'iOS' : 'Android'}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-600 dark:text-gray-400">Storage</Text>
              <Text className="text-gray-900 dark:text-white font-medium">
                SQLite + SecureStore
              </Text>
            </View>
          </View>
        </View>

        {/* Tech Stack Info */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Tech Stack
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {['Expo', 'TypeScript', 'NativeWind', 'SQLite', 'SecureStore', 'Expo Router'].map(
              (tech) => (
                <View
                  key={tech}
                  className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1.5 rounded-full"
                >
                  <Text className="text-primary-700 dark:text-primary-300 text-sm font-medium">
                    {tech}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
