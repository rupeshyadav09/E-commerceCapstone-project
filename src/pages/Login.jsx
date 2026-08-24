import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/slices/authSlice';

function Login() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value) => /.+@.+\..+/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    dispatch(login({ email }));
    setError('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 text-white shadow-sm">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gray-300">Your account</p>
          <h1 className="mb-3 text-3xl font-bold">Welcome back to ShopHub</h1>
          <p className="mb-6 max-w-md text-gray-200">
            Sign in to manage your wishlist, track orders, and keep your favorite fashion picks close at hand.
          </p>
          <ul className="space-y-3 text-sm text-gray-100">
            <li>• Save products to your personalized wishlist</li>
            <li>• Enjoy faster checkout with saved preferences</li>
            <li>• Receive order updates and exclusive deals</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold">Sign in</h2>
          <p className="mb-6 text-gray-600">Use your email and password to continue shopping.</p>
          {isLoggedIn && user && <p className="mb-4 rounded-lg bg-green-50 p-3 text-green-700" role="status">Logged in as {user.email}</p>}
          <form onSubmit={handleSubmit} noValidate>
            <label className="mb-1 block text-sm font-semibold" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-3"
            />
            <label className="mb-1 block text-sm font-semibold" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-3"
            />
            {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white">Login</button>
          </form>
          <button type="button" onClick={() => dispatch(logout())} className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Login;