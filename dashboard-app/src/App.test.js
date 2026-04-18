import { render, screen } from '@testing-library/react';
import App from './App';

test('renders enter access code text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Enter Access Code/i);
  expect(linkElement).toBeInTheDocument();
});
