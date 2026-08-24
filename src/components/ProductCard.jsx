import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { id, title, price, image, category, rating } = product || {};
  const displayRating = rating?.rate || 0;
  const isWishlisted = wishlistItems.some((item) => item.id === id);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <img src={image} alt={title} className="h-52 w-full object-cover" />

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-2 text-xs capitalize text-gray-500">{category}</p>
        <h3 className="mb-2 min-h-[44px] text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mb-2 text-base font-bold text-blue-600">${price}</p>
        <p className="mb-3 text-sm text-amber-500">⭐ {displayRating.toFixed(1)}</p>

        <div className="mt-auto flex flex-wrap gap-2">
          <button onClick={() => dispatch(addToCart(product))} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white">
            Add to Cart
          </button>
          <button
            onClick={() => dispatch(isWishlisted ? removeFromWishlist(id) : addToWishlist(product))}
            className={`rounded-lg border px-3 py-2 text-sm ${isWishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-300 bg-white text-gray-900'}`}
          >
            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
          </button>
          <Link to={`/product/${id}`} className="self-center text-sm font-medium text-blue-600 no-underline">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
