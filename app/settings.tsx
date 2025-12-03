import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Switch, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getUsername, saveUsername } from '../services/settings';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
    <ScrollView style={[styles.flex1, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <View style={{ padding: 16 }}>
        {/* Profile Section */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Profile</Text>
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.label, { color: isDark ? '#d1d5db' : '#374151' }]}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your name"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              style={[styles.input, { backgroundColor: isDark ? '#374151' : '#f9fafb', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }]}
              maxLength={50}
            />
          </View>
          <Pressable onPress={handleSaveUsername} disabled={isSaving} style={[styles.saveButton, { backgroundColor: isSaving ? '#60a5fa' : '#3b82f6' }]}>
            <Text style={{ color: '#ffffff', fontWeight: '600', textAlign: 'center' }}>{isSaving ? 'Saving...' : 'Save Username'}</Text>
          </Pressable>
          {saveMessage ? <Text style={{ textAlign: 'center', fontSize: 14, color: '#22c55e', marginTop: 8 }}>{saveMessage}</Text> : null}
        </View>

        {/* Appearance Section */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Appearance</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>{isDark ? '🌙' : '☀️'}</Text>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: isDark ? '#ffffff' : '#111827' }}>Dark Mode</Text>
                <Text style={{ fontSize: 14, color: isDark ? '#9ca3af' : '#6b7280' }}>{isDark ? 'Currently using dark theme' : 'Currently using light theme'}</Text>
              </View>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#d1d5db', true: '#3b82f6' }} thumbColor={Platform.OS === 'ios' ? '#ffffff' : isDark ? '#ffffff' : '#f4f4f5'} />
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>About</Text>
          {[['App Name', 'ProductivityApp'], ['Version', '1.0.0'], ['Platform', Platform.OS === 'web' ? 'Web' : Platform.OS === 'ios' ? 'iOS' : 'Android'], ['Storage', 'SQLite + SecureStore']].map(([label, value], i, arr) => (
            <View key={label} style={[styles.aboutRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#374151' : '#f3f4f6' }]}>
              <Text style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>{label}</Text>
              <Text style={{ color: isDark ? '#ffffff' : '#111827', fontWeight: '500' }}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Tech Stack</Text>
          <View style={styles.techRow}>
            {['Expo', 'TypeScript', 'SQLite', 'SecureStore', 'Expo Router'].map((tech) => (
              <View key={tech} style={[styles.techBadge, { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' }]}>
                <Text style={{ color: isDark ? '#93c5fd' : '#1d4ed8', fontSize: 14, fontWeight: '500' }}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  saveButton: { paddingVertical: 12, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
});
