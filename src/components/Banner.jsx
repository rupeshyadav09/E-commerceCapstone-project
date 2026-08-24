import { Link } from 'react-router-dom';

function Banner() {
  return (
    <section className="mb-6 flex flex-col items-center justify-between gap-6 rounded-[20px] bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-8 text-white sm:flex-row sm:px-8 lg:px-10 lg:py-10">
      <div className="max-w-xl text-center sm:text-left">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] opacity-90">New Collection</p>
        <h2 className="mb-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          Fresh picks for your everyday style
        </h2>
        <p className="mb-4 text-sm leading-6 opacity-95 sm:text-base">
          Discover trending fashion, electronics, and home essentials at amazing prices.
        </p>
        <Link to="/#product-catalog" className="inline-block rounded-full bg-white px-4 py-2 font-bold text-gray-900 no-underline">
          Shop Now
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white/20 text-5xl sm:h-52 sm:w-52">
          🛍️
        </div>
      </div>
    </section>
  );
}

export default Banner;
