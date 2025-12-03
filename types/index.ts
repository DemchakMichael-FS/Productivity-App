// Task priority levels
export type Priority = 'high' | 'medium' | 'low';

// Task filter options
export type FilterType = 'all' | 'active' | 'completed';

// Task interface for the database
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

// Task creation input (without id and createdAt)
export interface TaskInput {
  title: string;
  description: string;
  priority: Priority;
}

// Task statistics
export interface TaskStats {
  total: number;
  completed: number;
  active: number;
}

// Theme type
export type Theme = 'light' | 'dark';

// User settings stored in SecureStore
export interface UserSettings {
  username: string;
  theme: Theme;
}

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
