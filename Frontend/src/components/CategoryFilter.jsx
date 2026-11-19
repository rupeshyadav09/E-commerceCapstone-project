function CategoryFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" aria-label="Product categories">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          aria-pressed={activeCategory === category}
          className={`rounded-full border px-3 py-2 text-sm transition-colors ${activeCategory === category ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100'}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
