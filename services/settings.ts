import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Theme, UserSettings } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * Web fallback storage using localStorage.
 * SecureStore is not available on web, so we use localStorage as a fallback.
 */
const webStorage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  async deleteItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

/**
 * Get the appropriate storage based on platform.
 */
function getStorage() {
  if (Platform.OS === 'web') {
    return webStorage;
  }
  return {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    deleteItem: SecureStore.deleteItemAsync,
  };
}

/**
 * Get the stored username.
 */
export async function getUsername(): Promise<string> {
  try {
    const storage = getStorage();
    const username = await storage.getItem(STORAGE_KEYS.USERNAME);
    return username || '';
  } catch (error) {
    console.error('Failed to get username:', error);
    return '';
  }
}

/**
 * Save the username.
 */
export async function saveUsername(username: string): Promise<void> {
  try {
    const storage = getStorage();
    await storage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.error('Failed to save username:', error);
    throw new Error('Failed to save username');
  }
}

/**
 * Get the stored theme preference.
 */
export async function getTheme(): Promise<Theme> {
  try {
    const storage = getStorage();
    const theme = await storage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    return 'light'; // Default theme
  } catch (error) {
    console.error('Failed to get theme:', error);
    return 'light';
  }
}

/**
 * Save the theme preference.
 */
export async function saveTheme(theme: Theme): Promise<void> {
  try {
    const storage = getStorage();
    await storage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
    throw new Error('Failed to save theme');
  }
}

/**
 * Get all user settings.
 */
export async function getUserSettings(): Promise<UserSettings> {
  const [username, theme] = await Promise.all([getUsername(), getTheme()]);
  return { username, theme };
}

/**
 * Clear all user settings.
 */
export async function clearUserSettings(): Promise<void> {
  try {
    const storage = getStorage();
    await Promise.all([
      storage.deleteItem(STORAGE_KEYS.USERNAME),
      storage.deleteItem(STORAGE_KEYS.THEME),
    ]);
  } catch (error) {
    console.error('Failed to clear settings:', error);
    throw new Error('Failed to clear settings');
  }
}
