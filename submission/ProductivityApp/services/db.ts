import { Platform } from 'react-native';
import { Task, TaskInput, TaskStats, Priority } from '../types';
import { DATABASE_NAME } from '../constants';

// ============================================================================
// WEB FALLBACK - localStorage-based storage
// ============================================================================

const WEB_STORAGE_KEY = 'productivity_tasks';
let webTasks: Task[] = [];
let webIdCounter = 1;

function loadWebStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(WEB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        webTasks = parsed.tasks || [];
        webIdCounter = parsed.idCounter || 1;
      }
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
}

function saveWebStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(
        WEB_STORAGE_KEY,
        JSON.stringify({ tasks: webTasks, idCounter: webIdCounter })
      );
    }
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// ============================================================================
// NATIVE - SQLite storage
// ============================================================================

let db: any = null;
let SQLite: any = null;

async function initNativeDatabase(): Promise<void> {
  try {
    // Dynamic import for native platforms only
    SQLite = require('expo-sqlite');
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL CHECK(priority IN ('high', 'medium', 'low')),
        completed INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error);
    throw new Error('Database initialization failed');
  }
}

// ============================================================================
// UNIFIED API - Platform-aware functions
// ============================================================================

const isWeb = Platform.OS === 'web';

/**
 * Initialize the database.
 * Uses localStorage on web, SQLite on native.
 */
export async function initDatabase(): Promise<void> {
  if (isWeb) {
    loadWebStorage();
    console.log('Web database initialized with localStorage');
  } else {
    await initNativeDatabase();
  }
}

/**
 * Create a new task.
 */
export async function createTask(input: TaskInput): Promise<Task> {
  const createdAt = new Date().toISOString();

  if (isWeb) {
    const task: Task = {
      id: webIdCounter++,
      title: input.title,
      description: input.description,
      priority: input.priority,
      completed: false,
      createdAt,
    };
    webTasks.unshift(task);
    saveWebStorage();
    return task;
  }

  // Native SQLite
  try {
    const result = await db.runAsync(
      'INSERT INTO tasks (title, description, priority, completed, createdAt) VALUES (?, ?, ?, 0, ?)',
      [input.title, input.description, input.priority, createdAt]
    );

    return {
      id: result.lastInsertRowId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      completed: false,
      createdAt,
    };
  } catch (error) {
    console.error('Failed to create task:', error);
    throw new Error('Failed to create task');
  }
}

/**
 * Get all tasks.
 */
export async function getAllTasks(): Promise<Task[]> {
  if (isWeb) {
    return [...webTasks];
  }

  try {
    const rows = await db.getAllAsync<{
      id: number;
      title: string;
      description: string;
      priority: string;
      completed: number;
      createdAt: string;
    }>('SELECT * FROM tasks ORDER BY createdAt DESC');

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority as Priority,
      completed: row.completed === 1,
      createdAt: row.createdAt,
    }));
  } catch (error) {
    console.error('Failed to get tasks:', error);
    throw new Error('Failed to retrieve tasks');
  }
}

/**
 * Get a single task by ID.
 */
export async function getTaskById(id: number): Promise<Task | null> {
  if (isWeb) {
    return webTasks.find((t) => t.id === id) || null;
  }

  try {
    const row = await db.getFirstAsync<{
      id: number;
      title: string;
      description: string;
      priority: string;
      completed: number;
      createdAt: string;
    }>('SELECT * FROM tasks WHERE id = ?', [id]);

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority as Priority,
      completed: row.completed === 1,
      createdAt: row.createdAt,
    };
  } catch (error) {
    console.error('Failed to get task:', error);
    throw new Error('Failed to retrieve task');
  }
}

/**
 * Toggle task completion status.
 */
export async function toggleTaskCompletion(id: number): Promise<void> {
  if (isWeb) {
    const task = webTasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveWebStorage();
    }
    return;
  }

  try {
    await db.runAsync('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to toggle task completion:', error);
    throw new Error('Failed to update task');
  }
}

/**
 * Delete a task.
 */
export async function deleteTask(id: number): Promise<void> {
  if (isWeb) {
    webTasks = webTasks.filter((t) => t.id !== id);
    saveWebStorage();
    return;
  }

  try {
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Failed to delete task');
  }
}

/**
 * Get task statistics.
 */
export async function getTaskStats(): Promise<TaskStats> {
  if (isWeb) {
    const total = webTasks.length;
    const completed = webTasks.filter((t) => t.completed).length;
    return { total, completed, active: total - completed };
  }

  try {
    const totalResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM tasks'
    );
    const completedResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM tasks WHERE completed = 1'
    );

    const total = totalResult?.count ?? 0;
    const completed = completedResult?.count ?? 0;

    return { total, completed, active: total - completed };
  } catch (error) {
    console.error('Failed to get task stats:', error);
    throw new Error('Failed to retrieve task statistics');
  }
}

/**
 * Update a task.
 */
export async function updateTask(id: number, input: Partial<TaskInput>): Promise<void> {
  if (isWeb) {
    const task = webTasks.find((t) => t.id === id);
    if (task) {
      if (input.title !== undefined) task.title = input.title;
      if (input.description !== undefined) task.description = input.description;
      if (input.priority !== undefined) task.priority = input.priority;
      saveWebStorage();
    }
    return;
  }

  try {
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title);
    }
    if (input.description !== undefined) {
      updates.push('description = ?');
      values.push(input.description);
    }
    if (input.priority !== undefined) {
      updates.push('priority = ?');
      values.push(input.priority);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.runAsync(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error('Failed to update task');
  }
}
