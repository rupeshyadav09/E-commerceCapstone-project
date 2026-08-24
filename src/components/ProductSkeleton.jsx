function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 h-48 rounded-xl bg-gray-200" />
      <div className="mb-2 h-3 w-1/3 rounded-full bg-gray-200" />
      <div className="mb-2 h-4 w-full rounded-full bg-gray-200" />
      <div className="mb-3 h-4 w-2/5 rounded-full bg-gray-200" />
      <div className="h-9 w-28 rounded-lg bg-gray-200" />
    </div>
  );
}

export default ProductSkeleton;
