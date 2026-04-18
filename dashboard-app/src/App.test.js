import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Enter Access Code heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Enter Access Code/i);
  expect(headingElement).toBeInTheDocument();
});
