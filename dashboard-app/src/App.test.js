import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders login screen initially', () => {
  render(<App />);
  const enterAccessCodeElement = screen.getByText(/Enter Access Code/i);
  expect(enterAccessCodeElement).toBeInTheDocument();

  const guestModeButton = screen.getByText(/Guest Mode/i);
  expect(guestModeButton).toBeInTheDocument();
});

test('enters guest mode and adds a task', () => {
  render(<App />);

  // Click guest mode
  const guestModeButton = screen.getByText(/Guest Mode/i);
  fireEvent.click(guestModeButton);

  // Verify main screen elements
  const searchInput = screen.getByPlaceholderText(/Search task or category.../i);
  expect(searchInput).toBeInTheDocument();

  const taskInput = screen.getByPlaceholderText(/^Task$/i);
  expect(taskInput).toBeInTheDocument();

  const categoryInput = screen.getByPlaceholderText(/^Category$/i);
  expect(categoryInput).toBeInTheDocument();

  // Add a task
  fireEvent.change(taskInput, { target: { value: 'Write Tests' } });
  fireEvent.change(categoryInput, { target: { value: 'Testing' } });

  const addButton = screen.getByText(/^Add$/i);
  fireEvent.click(addButton);

  // Verify task was added
  const taskText = screen.getByText(/Write Tests/i);
  expect(taskText).toBeInTheDocument();

  const categoryText = screen.getByText(/Testing/i);
  expect(categoryText).toBeInTheDocument();
});
