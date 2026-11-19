import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 px-4 py-10 text-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold">About Company</h3>
          <p className="leading-6 text-gray-300">
            ShopHub offers the latest products, great deals, and a smooth online shopping experience.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Home</li>
            <li>Shop</li>
            <li>Wishlist</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Contact</h3>
          <p className="mb-1 text-gray-300">📧 info@shophub.com</p>
          <p className="text-gray-300">📞 +1 234 567 890</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Newsletter Subscribe</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
            />
            <button type="submit" className="rounded-lg bg-amber-500 px-3 py-2 font-semibold text-gray-900">
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © 2026 ShopHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
