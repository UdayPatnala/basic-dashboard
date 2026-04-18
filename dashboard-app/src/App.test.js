import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders login screen initially', () => {
  render(<App />);
  const loginHeader = screen.getByText(/Enter Access Code/i);
  expect(loginHeader).toBeInTheDocument();
});

test('addTask function adds a new task', async () => {
  render(<App />);

  // Bypass login
  const guestModeButton = screen.getByText(/Guest Mode/i);
  userEvent.click(guestModeButton);

  // Find inputs and add button
  const taskInput = screen.getByPlaceholderText('Task');
  const categoryInput = screen.getByPlaceholderText('Category');
  const addButton = screen.getByText('Add');

  // Type in values
  userEvent.type(taskInput, 'New Test Task');
  userEvent.type(categoryInput, 'Test Category');

  // Click add
  userEvent.click(addButton);

  // Verify task was added
  const addedTask = await screen.findByText('New Test Task');
  expect(addedTask).toBeInTheDocument();
});
