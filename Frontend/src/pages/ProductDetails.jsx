import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addProductToCart, addProductToFavorites, removeProductFromFavorites } from '../services/productApi';

function Product() {
  const dispatch = useDispatch();
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const { id } = useParams();
  const product = useSelector((state) => state.products.items.find((item) => item.id === Number(id)));
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => String(item.id) === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="mb-6 text-gray-600">This product may have been removed or is still loading.</p>
        <Link to="/" className="inline-block rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white no-underline">Back to shop</Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setBusy(true);
    try {
      await addProductToCart(product);
      dispatch(addToCart(product));
      setNotice('Product added to cart.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleWishlist = async () => {
    setBusy(true);
    try {
      if (isWishlisted) {
        await removeProductFromFavorites(product.id);
        dispatch(removeFromWishlist(product.id));
        setNotice('Product removed from favorites.');
      } else {
        await addProductToFavorites(product);
        dispatch(addToWishlist(product));
        setNotice('Product added to favorites.');
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/" className="mb-6 inline-block text-sm font-semibold text-blue-600 no-underline">← Continue shopping</Link>
      <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(280px,360px)_1fr] md:p-8">
        <img src={product.image} alt={product.title} className="h-80 w-full rounded-xl border border-gray-200 object-contain p-6" />

        <div>
          <p className="mb-2 text-sm capitalize text-gray-500">{product.category}</p>
          <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>
          <p className="mb-3 font-semibold text-amber-500">⭐ {product.rating?.rate?.toFixed(1)} / 5</p>
          <p className="mb-4 text-2xl font-bold text-blue-600">${product.price}</p>
          <p className="mb-6 leading-7 text-gray-600">{product.description}</p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleAddToCart} disabled={busy} className="rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white disabled:opacity-60">
              Add to Cart
            </button>
            <button type="button" onClick={handleWishlist} disabled={busy} className={`rounded-lg border px-4 py-3 font-semibold disabled:opacity-60 ${isWishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-300 bg-white text-gray-900'}`}>
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
          {notice && <p className="mt-4 text-sm text-gray-600" role="status">{notice}</p>}
        </div>
      </div>
    </div>
  );
}

export default Product;