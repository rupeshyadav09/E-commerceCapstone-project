# ShopHub

ShopHub is a React/Vite storefront with an Express API. The API reads and normalizes the product catalogue from DummyJSON and stores cart and favorite snapshots in MongoDB.

## Repository layout

- `Frontend/` — React, Vite, Redux Toolkit, and Tailwind CSS.
- `Backend/` — Express API, MongoDB models, and API tests.

## Run locally

Requirements: Node.js 22.x and MongoDB (local or Atlas).

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGODB_URI`.
2. In a terminal, start the API:

   ```powershell
   Set-Location Backend
   npm ci
   npm run dev
   ```

3. In a second terminal, start the storefront:

   ```powershell
   Set-Location Frontend
   npm ci
   npm run dev
   ```

The local API defaults to `http://localhost:8080`; the Vite app defaults to `http://localhost:5173`. The frontend can point at another API using `VITE_API_BASE_URL` in `Frontend/.env`.

## Deploy (recommended: Vercel frontend + Render API)

You need a MongoDB Atlas database and accounts for the hosting providers. Deploy the API first; then configure the storefront with its public API URL.

### 1. Deploy the API to Render

Create a Render Blueprint from this repository and select `Backend/render.yaml`, or create a Web Service manually with:

- Root Directory: `Backend`
- Runtime: Node
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/`
- Node.js: `22.19.0` (also pinned in `Backend/.node-version`)

Set these Render environment variables:

- `MONGODB_URI` — your Atlas connection string; keep it private.
- `CORS_ORIGIN` — the exact deployed frontend origin, such as `https://your-store.vercel.app` (no trailing slash).
- `PRODUCTS_API_URL` is optional; the default is `https://dummyjson.com/products`.

The service needs a reachable MongoDB database to start. For Atlas, create a database user and allow the Render service to connect in Atlas Network Access. Use a strong password and never commit `.env` or database credentials.

### 2. Deploy the frontend to Vercel

Import the same Git repository as a Vercel project and set:

- Root Directory: `Frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: `22.x`
- Environment Variable: `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`

Set `VITE_API_BASE_URL` for Production (and Preview if you use preview deployments). Vite embeds it into the build, so redeploy after changing it. The frontend `vercel.json` supports direct visits and refreshes on client-side routes.

### 3. Finish CORS and verify

After Vercel gives you the frontend domain, set that exact origin as Render's `CORS_ORIGIN`, then redeploy the API. If using a custom domain, include that origin as well (comma-separated).

Replace the example hosts below and open:

- `https://<your-render-service>.onrender.com/` — API health response.
- `https://<your-render-service>.onrender.com/products/categories` — category list.
- `https://<your-render-service>.onrender.com/products` — product list.
- `https://<your-frontend>.vercel.app/` — storefront; also refresh `/cart`, `/wishlist`, and a `/product/<id>` page.

Render's free service may sleep when idle and take time to wake on the first request.

## Alternative: deploy both projects to Vercel

Create two Vercel projects from the same repository:

1. Backend project: Root Directory `Backend`; set `MONGODB_URI` and `CORS_ORIGIN` to the frontend's exact origin.
2. Frontend project: Root Directory `Frontend`; set `VITE_API_BASE_URL` to the backend Vercel domain.
3. Redeploy both after setting the environment variables and verify the API URLs above.

## Tests and checks

Run commands from the corresponding directory:

```powershell
# Backend
npm test

# Frontend
npm run lint
npm test -- --run
npm run build
```

The backend tests use in-memory model doubles and do not require MongoDB or an external catalogue connection.
