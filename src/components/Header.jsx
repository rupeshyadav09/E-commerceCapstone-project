import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-lg font-bold text-gray-900 no-underline">
          🏷️ ShopHub
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link to="/#product-catalog" className="flex min-w-[200px] items-center rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-500 no-underline sm:min-w-[220px]">
            <span className="mr-2">🔍</span>
            <span>Search products</span>
          </Link>

          <Link to="/wishlist" role="button" aria-label={`Wishlist, ${wishlistCount} items`} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 no-underline">
            <span>❤️</span>
            <span>{wishlistCount}</span>
          </Link>
          <Link to="/cart" role="button" aria-label={`Cart, ${cartCount} items`} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 no-underline">
            <span>🛒</span>
            <span>{cartCount}</span>
          </Link>
          <button type="button" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm">🔔</button>

          <Link to="/login" role="button" aria-label="Login" className="rounded-full bg-gray-900 px-4 py-2 font-semibold text-white no-underline">
            👤 Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
