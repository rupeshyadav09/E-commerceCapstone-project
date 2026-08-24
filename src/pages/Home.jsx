import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { getCategories } from '../services/productApi';
import Banner from '../components/Banner';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import { ProductGrid, ProductGridSkeleton } from '../components/ProductGrid';
import WhatWeSell from '../components/WhatWeSell';
import FAQ from '../components/FAQ';

function Home() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Load both page data sets once and remove the global listener when the page unmounts.
    dispatch(fetchProducts());

    getCategories().then(setCategories).catch(() => setCategories([]));

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Banner />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter
          categories={['All', ...categories]}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div id="product-catalog" className="scroll-mt-6">
          {loading && (
            <ProductGridSkeleton />
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
              Unable to load products right now. Please try again later.
            </div>
          )}

          {!loading && !error && (
            <ProductGrid
              // Filtering stays at the page level so ProductGrid remains reusable and presentational.
              products={products
                .filter((product) => activeCategory === 'All' || product.category === activeCategory)
                .filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))}
            />
          )}
        </div>

        <WhatWeSell />
        <FAQ />
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          className="fixed right-6 bottom-6 rounded-full bg-gray-900 px-4 py-3 text-white shadow-lg"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}

export default Home;