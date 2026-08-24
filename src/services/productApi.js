const API_BASE_URL = 'https://fakestoreapi.com/products';

async function requestJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

// Centralizing HTTP handling keeps response validation consistent for every API request.
export function getProducts() {
  return requestJson(API_BASE_URL);
}

// Categories share the products endpoint, but remain a separate service method for UI use.
export function getCategories() {
  return requestJson(`${API_BASE_URL}/categories`);
}
