import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const storedItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return Array.isArray(storedItems) ? storedItems : [];
  } catch {
    // Treat corrupted browser data as an empty wishlist instead of crashing initialization.
    return [];
  }
};

const initialState = {
  items: loadFromStorage(),
};

// Wishlist state is persisted after each mutation so user selections survive a refresh.
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
