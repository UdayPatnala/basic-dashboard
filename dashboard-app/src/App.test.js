import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { loadTasks, saveTasks, addTask, updateTask, deleteTask, loadConfig, saveConfig, clearStorage, STORAGE_KEYS } from './utils/storage';

describe('Dashboard v1 Storage Utility & Component Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    clearStorage();
  });

  describe('Persistent State Manager (storage.js)', () => {
    it('returns empty array when no tasks are stored', () => {
      const tasks = loadTasks([]);
      expect(tasks).toEqual([]);
    });

    it('saves and loads tasks correctly', () => {
      const sampleTasks = [
        { id: 1, text: 'Complete React testing', category: 'Web', date: '2026-07-23', completed: false },
        { id: 2, text: 'Review Spring Boot API', category: 'Java', date: '2026-07-23', completed: true },
      ];
      saveTasks(sampleTasks);

      const loaded = loadTasks();
      expect(loaded).toHaveLength(2);
      expect(loaded[0].text).toBe('Complete React testing');
      expect(loaded[1].completed).toBe(true);
    });

    it('adds a new task using addTask() helper', () => {
      const newTask = addTask({ text: 'Implement Redis caching', category: 'Tools', date: '2026-07-23' });
      expect(newTask).toHaveLength(1);
      expect(newTask[0].text).toBe('Implement Redis caching');
      expect(loadTasks()).toHaveLength(1);
    });

    it('updates a task using updateTask() helper', () => {
      addTask({ id: 101, text: 'Refactor state manager', category: 'Project', date: '2026-07-23', completed: false });
      const updated = updateTask(101, { completed: true });
      expect(updated[0].completed).toBe(true);
      expect(loadTasks()[0].completed).toBe(true);
    });

    it('deletes a task using deleteTask() helper', () => {
      addTask({ id: 201, text: 'Task to be removed', category: 'DSA', date: '2026-07-23' });
      expect(loadTasks()).toHaveLength(1);
      const afterDelete = deleteTask(201);
      expect(afterDelete).toHaveLength(0);
      expect(loadTasks()).toHaveLength(0);
    });

    it('saves and loads configuration settings', () => {
      saveConfig({ accessCode: 'PASS123', selectedDate: '2026-10-15' });
      const config = loadConfig();
      expect(config.accessCode).toBe('PASS123');
      expect(config.selectedDate).toBe('2026-10-15');
    });
  });

  describe('App Component CRUD Operations & Authentication', () => {
    it('renders login authentication screen by default', () => {
      render(<App />);
      expect(screen.getByPlaceholderText(/Enter Access Code/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Authenticate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Guest User/i })).toBeInTheDocument();
    });

    it('logs in as Guest User and shows empty task dashboard', async () => {
      render(<App />);
      const guestButton = screen.getByRole('button', { name: /Guest User/i });
      fireEvent.click(guestButton);

      expect(screen.getByText(/TaskMaster Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/Guest Mode/i)).toBeInTheDocument();
      expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    });

    it('authenticates with correct access code and displays default tasks', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/Enter Access Code/i);
      const authBtn = screen.getByRole('button', { name: /Authenticate/i });

      fireEvent.change(input, { target: { value: 'TASKMASTER2026' } });
      fireEvent.click(authBtn);

      expect(screen.getByText(/Authenticated/i)).toBeInTheDocument();
    });

    it('persists added task to localStorage in App component', async () => {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Guest User/i }));

      const descInput = screen.getByPlaceholderText(/What needs to be done\?/i);
      const catInput = screen.getByPlaceholderText(/Type category\.\.\./i);

      fireEvent.change(descInput, { target: { value: 'Build vitest component suite' } });
      fireEvent.change(catInput, { target: { value: 'Testing' } });

      const addBtn = screen.getByRole('button', { name: /Add Task/i });
      fireEvent.click(addBtn);

      expect(screen.getByText(/Build vitest component suite/i)).toBeInTheDocument();
    });
  });
});
