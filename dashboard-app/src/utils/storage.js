/**
 * Dashboard v1 Persistent State Manager
 * Handles LocalStorage persistence for tasks, categories, and system configuration.
 */

export const STORAGE_KEYS = {
  TASKS: "tasks",
  CONFIG: "dashboard_config",
};

/**
 * Helper to check if localStorage is available in execution context
 */
const isStorageAvailable = () => {
  try {
    return typeof window !== "undefined" && window.localStorage !== undefined;
  } catch (e) {
    return false;
  }
};

/**
 * Load tasks from localStorage, with fallback to default tasks
 * @param {Array} defaultTasks - Initial tasks if storage is empty
 * @returns {Array} List of stored or default tasks
 */
export const loadTasks = (defaultTasks = []) => {
  if (!isStorageAvailable()) return defaultTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return defaultTasks;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTasks;
  } catch (err) {
    console.error("Error loading tasks from localStorage:", err);
    return defaultTasks;
  }
};

/**
 * Save tasks array to localStorage
 * @param {Array} tasks - List of tasks to persist
 */
export const saveTasks = (tasks) => {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error("Error saving tasks to localStorage:", err);
  }
};

/**
 * Add a new task to localStorage and return updated tasks
 * @param {Object} newTask - Task details (text, category, date)
 * @returns {Array} Updated list of tasks
 */
export const addTask = (newTask) => {
  const current = loadTasks();
  const item = {
    id: newTask.id || Date.now(),
    text: newTask.text,
    category: newTask.category || "General",
    date: newTask.date || new Date().toLocaleDateString("en-CA"),
    completed: Boolean(newTask.completed),
  };
  const updated = [item, ...current];
  saveTasks(updated);
  return updated;
};

/**
 * Update an existing task by ID
 * @param {number|string} id - ID of task to update
 * @param {Object} updates - Fields to update
 * @returns {Array} Updated list of tasks
 */
export const updateTask = (id, updates) => {
  const current = loadTasks();
  const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveTasks(updated);
  return updated;
};

/**
 * Toggle completed state of a task
 * @param {number|string} id - Task ID
 * @returns {Array} Updated tasks
 */
export const toggleTaskStatus = (id) => {
  const current = loadTasks();
  const updated = current.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks(updated);
  return updated;
};

/**
 * Delete a task by ID
 * @param {number|string} id - Task ID
 * @returns {Array} Updated tasks
 */
export const deleteTask = (id) => {
  const current = loadTasks();
  const updated = current.filter((t) => t.id !== id);
  saveTasks(updated);
  return updated;
};

/**
 * Load system configuration from localStorage
 * @param {Object} defaultConfig - Fallback config values
 * @returns {Object} System configuration
 */
export const loadConfig = (defaultConfig = {}) => {
  if (!isStorageAvailable()) return defaultConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Error loading config from localStorage:", err);
    return defaultConfig;
  }
};

/**
 * Save configuration to localStorage
 * @param {Object} config - Configuration key-value pairs
 */
export const saveConfig = (config) => {
  if (!isStorageAvailable()) return;
  try {
    const existing = loadConfig();
    const updated = { ...existing, ...config };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving config to localStorage:", err);
  }
};

/**
 * Clear all dashboard state from localStorage
 */
export const clearStorage = () => {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  } catch (err) {
    console.error("Error clearing storage:", err);
  }
};
