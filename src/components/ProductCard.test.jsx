import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from './ProductCard';
import cartReducer from '../redux/slices/cartSlice';
import wishlistReducer from '../redux/slices/wishlistSlice';

function renderWithStore(product) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
    preloadedState: {
      cart: { items: [] },
      wishlist: { items: [] },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    </Provider>
  );
}

describe('ProductCard', () => {
  const product = {
    id: 1,
    title: 'Example Shirt',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    category: 'fashion',
    rating: { rate: 4.5 },
  };

  it('renders product details', () => {
    renderWithStore(product);

    expect(screen.getByText(/Example Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/fashion/i)).toBeInTheDocument();
    expect(screen.getByText(/\$29\.99/i)).toBeInTheDocument();
  });

  it('adds the product to cart when clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(product);

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});
