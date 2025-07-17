import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LinkedIn connection link', () => {
  render(<App />);
  const linkElement = screen.getByText(/connect with me on linkedin/i);
  expect(linkElement).toBeInTheDocument();
});