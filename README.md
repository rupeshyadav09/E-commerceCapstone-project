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

Tests use a single threaded Vitest worker for predictable execution in constrained environments.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
