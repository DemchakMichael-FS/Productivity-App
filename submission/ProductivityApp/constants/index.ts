// Priority color mapping for NativeWind classes
export const PRIORITY_COLORS = {
  high: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-500',
    border: 'border-red-500',
  },
  medium: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-500',
    border: 'border-amber-500',
  },
  low: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-500',
    border: 'border-green-500',
  },
} as const;

// Priority labels for display
export const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const;

// Filter labels for display
export const FILTER_LABELS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
} as const;

// SecureStore keys
export const STORAGE_KEYS = {
  USERNAME: 'user_username',
  THEME: 'user_theme',
} as const;

// Database name
export const DATABASE_NAME = 'productivity.db';
