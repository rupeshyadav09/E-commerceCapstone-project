import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { replaceWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { getFavorites, removeProductFromFavorites } from '../services/productApi';

function Wishlist() {
  const dispatch = useDispatch();
  const [notice, setNotice] = useState('');
  const items = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    let active = true;
    getFavorites()
      .then((favorites) => {
        if (active) dispatch(replaceWishlist(favorites));
      })
      .catch((error) => {
        if (active) setNotice(`Unable to sync favorites: ${error.message}`);
      });
    return () => { active = false; };
  }, [dispatch]);

  const removeFavorite = async (productId) => {
    try {
      await removeProductFromFavorites(productId);
      dispatch(removeFromWishlist(productId));
      setNotice('');
    } catch (error) {
      setNotice(`Unable to remove favorite: ${error.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 p-6 ring-1 ring-rose-100">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Your wishlist</h1>
        <p className="text-gray-600">Save products you love and come back when you are ready to buy.</p>
      </div>

      {notice && <p className="mb-4 text-sm text-red-600" role="alert">{notice}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-4xl">💝</div>
          <p className="mb-5 text-gray-600">Your wishlist is empty.</p>
          <Link to="/" className="inline-block rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white no-underline">Explore products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Saved items</p>
            <p className="text-2xl font-bold text-gray-900">{items.length} product{items.length > 1 ? 's' : ''}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-5 shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 py-4 last:border-b-0">
                <div>
                  <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 no-underline">{item.title}</Link>
                  <p className="text-blue-600">${item.price}</p>
                </div>
                <button type="button" onClick={() => removeFavorite(item.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;