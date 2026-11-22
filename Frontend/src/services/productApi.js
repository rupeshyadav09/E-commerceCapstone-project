const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:8080' : '')
).replace(/\/$/, '');
const USER_ID_KEY = 'shopHubUserId';

function getUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

async function requestJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL to the deployed backend URL before building the frontend.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'X-User-Id': getUserId(), ...options.headers },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.message) message = body.message;
    } catch {
      // Keep the HTTP status message when the server does not return JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

function postJson(path, body) {
  return requestJson(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function getProducts() {
  return requestJson('/products');
}

export function getCategories() {
  return requestJson('/products/categories');
}

export function getCart() {
  return requestJson('/cart');
}

export function addProductToCart(product) {
  return postJson('/api/cart', { product });
}

export function updateCartQuantity(productId, quantity) {
  return requestJson(`/api/cart/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

export function removeProductFromCart(productId) {
  return requestJson(`/api/cart/${encodeURIComponent(productId)}`, { method: 'DELETE' });
}

export function getFavorites() {
  return requestJson('/favorites');
}

export function addProductToFavorites(product) {
  return postJson('/api/favorites', { product });
}

export function removeProductFromFavorites(productId) {
  return requestJson(`/api/favorites/${encodeURIComponent(productId)}`, { method: 'DELETE' });
}
