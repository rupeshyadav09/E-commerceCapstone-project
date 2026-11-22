# ShopHub frontend

Responsive React/Vite storefront. It uses the Express API for the catalogue, cart, and favorites.

## Local development

Run the backend first using [Backend/README.md](../Backend/README.md). Then, from `Frontend/`:

```bash
npm ci
npm run dev
```

In development, the API defaults to `http://localhost:8080`. To use another backend, set `VITE_API_BASE_URL` in `Frontend/.env`. For production, this variable must be set to the deployed backend's base URL; it is embedded at build time, so redeploy after changing it. Do not put secrets in `VITE_*` variables.

## Deploy to Vercel

Create a Vercel project from this repository and configure:

- Root Directory: `Frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `22.x`
- Environment Variable: `VITE_API_BASE_URL=https://<your-backend-domain>`

The included `vercel.json` rewrites client-side routes to the Vite app, so direct visits and refreshes on `/cart`, `/wishlist`, and `/product/:id` work. Set the API URL for Production (and Preview if needed), then redeploy.

## Quality checks

```bash
npm run lint
npm test -- --run
npm run build
```
