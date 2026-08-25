# ShopHub

ShopHub is a responsive React e-commerce application built with Vite, Redux Toolkit, React Router, and Tailwind CSS. Product data comes from the Fake Store API.

## Features

- Product search and category filtering
- Product details with cart and wishlist actions
- Cart quantity management and order total calculation
- Login, wishlist, newsletter, FAQ, loading, and error states
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

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm test -- --run
npm run build
```



