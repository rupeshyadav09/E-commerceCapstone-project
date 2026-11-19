import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const GRID_CLASSES = 'mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4';

// This component only renders the already-filtered collection supplied by the page.
export function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className="mb-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">No products match your search.</p>;
  }

  return (
    <div className={GRID_CLASSES}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className={GRID_CLASSES} aria-label="Loading products">
      {Array.from({ length: 8 }, (_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
