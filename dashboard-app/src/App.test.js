import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Authentication Flow', () => {
  beforeEach(() => {
    // Mock localStorage to avoid issues with tasks saving/loading
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders login screen initially', () => {
    render(<App />);
    expect(screen.getByText(/Enter Access Code/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter/i })).toBeInTheDocument();
  });

  test('shows alert on invalid access code', () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);

    // Find input and enter button
    const inputElement = screen.getByRole('textbox');
    const enterButton = screen.getByRole('button', { name: /Enter/i });

    // Input invalid code
    fireEvent.change(inputElement, { target: { value: '12345' } });

    // Click enter
    fireEvent.click(enterButton);

    // Assert alert was called
    expect(alertMock).toHaveBeenCalledWith('Invalid Code');

    // Ensure we are still on the login screen
    expect(screen.getByText(/Enter Access Code/i)).toBeInTheDocument();
  });

  test('logs in successfully with valid access code', () => {
    render(<App />);

    const inputElement = screen.getByRole('textbox');
    const enterButton = screen.getByRole('button', { name: /Enter/i });

    // Input valid code (from App.js: "9703660750" or "8639481969")
    fireEvent.change(inputElement, { target: { value: '9703660750' } });

    // Click enter
    fireEvent.click(enterButton);

    // Assert login screen is gone and main app features are visible
    expect(screen.queryByText(/Enter Access Code/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('logs in successfully with Guest Mode', () => {
    render(<App />);

    const guestButton = screen.getByRole('button', { name: /Guest Mode/i });

    // Click guest mode
    fireEvent.click(guestButton);

    // Assert login screen is gone
    expect(screen.queryByText(/Enter Access Code/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });
});
