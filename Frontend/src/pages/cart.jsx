import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { replaceCart, increaseQuantity, decreaseQuantity, removeFromCart } from '../redux/slices/cartSlice';
import { getCart, removeProductFromCart, updateCartQuantity } from '../services/productApi';

function Cart() {
  const dispatch = useDispatch();
  const [notice, setNotice] = useState('');
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    let active = true;
    getCart()
      .then((cartItems) => {
        if (active) dispatch(replaceCart(cartItems));
      })
      .catch((error) => {
        if (active) setNotice(`Unable to sync cart: ${error.message}`);
      });
    return () => { active = false; };
  }, [dispatch]);

  const changeQuantity = async (item, quantity) => {
    try {
      if (quantity < 1) {
        await removeProductFromCart(item.id);
        dispatch(removeFromCart(item.id));
      } else {
        await updateCartQuantity(item.id, quantity);
        if (quantity > item.quantity) dispatch(increaseQuantity(item.id));
        else dispatch(decreaseQuantity(item.id));
      }
      setNotice('');
    } catch (error) {
      setNotice(`Unable to update cart: ${error.message}`);
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeProductFromCart(productId);
      dispatch(removeFromCart(productId));
      setNotice('');
    } catch (error) {
      setNotice(`Unable to remove product: ${error.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 p-6 ring-1 ring-sky-100">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Your cart</h1>
        <p className="text-gray-600">Review your items before checkout and keep shopping with confidence.</p>
      </div>

      {notice && <p className="mb-4 text-sm text-red-600" role="alert">{notice}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-4xl">🛍️</div>
          <p className="mb-5 text-gray-600">Your cart is empty.</p>
          <a href="/" className="inline-block rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white no-underline">Start shopping</a>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 py-4 last:border-b-0">
                <div>
                  <h2 className="font-semibold text-gray-900">{item.title}</h2>
                  <p className="text-blue-600">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label={`Decrease quantity of ${item.title}`} onClick={() => changeQuantity(item, item.quantity - 1)} className="h-8 w-8 rounded border border-gray-300 bg-white">-</button>
                  <span>{item.quantity}</span>
                  <button type="button" aria-label={`Increase quantity of ${item.title}`} onClick={() => changeQuantity(item, item.quantity + 1)} className="h-8 w-8 rounded border border-gray-300 bg-white">+</button>
                </div>
                <button type="button" onClick={() => removeItem(item.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
              </div>
            ))}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
              <a href="/" className="text-sm font-semibold text-blue-600 no-underline">Continue shopping</a>
              <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-2 text-sm text-gray-500">Order summary</p>
              <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                <span>Amount due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm">
              🚚 Free delivery on orders above $50.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;