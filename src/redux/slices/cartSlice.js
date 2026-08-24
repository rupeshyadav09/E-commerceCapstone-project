import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const storedItems = JSON.parse(localStorage.getItem('cart') || '[]');
    return Array.isArray(storedItems)
      ? storedItems.map((item) => ({ ...item, quantity: item.quantity || 1 }))
      : [];
  } catch {
    // Invalid saved JSON should not prevent the shop from rendering with an empty cart.
    return [];
  }
};

const initialState = {
  items: loadFromStorage(),
};

// Cart actions update Redux and localStorage together to preserve the cart between sessions.
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
