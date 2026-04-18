import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Enter Access Code text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Enter Access Code/i);
  expect(linkElement).toBeInTheDocument();
});
