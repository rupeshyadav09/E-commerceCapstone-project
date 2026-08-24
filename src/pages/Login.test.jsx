import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from './Login';
import authReducer from '../redux/slices/authSlice';

function renderWithStore() {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: { user: null, isLoggedIn: false },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );
}

describe('Login', () => {
  it('shows a success state for valid credentials', async () => {
    const user = userEvent.setup();
    renderWithStore();

    await user.type(screen.getByPlaceholderText(/email/i), 'demo@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), '123456');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/logged in as/i)).toBeInTheDocument();
  });

  it('shows an error for an invalid email format', async () => {
    const user = userEvent.setup();
    renderWithStore();

    await user.type(screen.getByPlaceholderText(/email/i), 'invalid-email');
    await user.type(screen.getByPlaceholderText(/password/i), '123456');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/valid email address/i);
  });

  it('shows an error when password is too short', async () => {
    const user = userEvent.setup();
    renderWithStore();

    await user.type(screen.getByPlaceholderText(/email/i), 'demo@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), '123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/at least 6 characters/i);
  });
});
