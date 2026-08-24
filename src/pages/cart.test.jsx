import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Cart from './cart';
import cartReducer from '../redux/slices/cartSlice';

describe('Cart page', () => {
  it('shows an empty message when there are no items', () => {
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: { cart: { items: [] } },
    });

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart items when present', () => {
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: {
        cart: {
          items: [{ id: 1, title: 'Example Shirt', price: 29.99, quantity: 2 }],
        },
      },
    });

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText(/Example Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });
});
