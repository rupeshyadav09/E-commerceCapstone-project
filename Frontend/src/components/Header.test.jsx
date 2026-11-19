import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import cartReducer from '../redux/slices/cartSlice';
import wishlistReducer from '../redux/slices/wishlistSlice';

function renderWithStore(preloadedState = {}) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  );
}

describe('Header', () => {
  it('renders the brand and navigation actions', () => {
    renderWithStore();

    expect(screen.getByText(/ShopHub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows the cart count from redux state', () => {
    renderWithStore({
      cart: { items: [{ id: 1, quantity: 2 }] },
      wishlist: { items: [] },
    });

    expect(screen.getByRole('button', { name: /2/i })).toBeInTheDocument();
  });
});
