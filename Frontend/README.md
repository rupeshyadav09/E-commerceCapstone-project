# ShopHub

ShopHub is a responsive React e-commerce application built with Vite, Redux Toolkit, React Router, and Tailwind CSS. The Express backend proxies the Fake Store product catalogue and persists cart and favorite snapshots in MongoDB.

## Features

- Product search and category filtering
- Product details with cart and wishlist actions
- Cart quantity management and order total calculation
- Login, wishlist, newsletter, FAQ, loading, and error states
- MongoDB-backed cart and favorites through the Express API
- Responsive layout for mobile, tablet, and desktop screens

## Project Structure

```text
src/
	components/       Reusable presentational components and product states
	pages/            Route-level screens
	redux/            Store configuration and feature slices
	services/         API requests and response validation
	test/             Shared test setup
```

The page layer coordinates state and routing. API requests live in `services/`, Redux owns server data state, and reusable UI states live in `components/`. This separation keeps components focused and makes each layer easier to test.

## Local Development

Start the backend first by following [Backend/README.md](../Backend/README.md), then copy `.env.example` to `.env` if the backend is not running at `http://localhost:8080`.

```bash
npm install
npm run dev
```

`VITE_API_BASE_URL` points to the backend base URL; its default is `http://localhost:8080`.

## Quality Checks

```bash
npm run lint
npm test -- --run
npm run build
```



