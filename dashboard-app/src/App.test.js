import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the App component and shows the login screen', () => {
  render(<App />);
  const linkElement = screen.getByText(/Enter Access Code/i);
  expect(linkElement).toBeInTheDocument();
});
