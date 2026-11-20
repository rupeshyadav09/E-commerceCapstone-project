# ShopHub backend

Express API for the ShopHub storefront. The product catalogue is read from Fake Store API; cart and favorites are stored in MongoDB as validated product snapshots, so saved items remain available if the catalogue provider changes.

## Architecture

```text
index.js                 Exports the Express app for Vercel; starts HTTP server when run directly
app.js                   Configures Express, CORS, routes, Swagger and middleware
src/
  config/database.js     MongoDB connection
  controllers/            Request validation and response handling
  docs/openapi.js         OpenAPI 3 specification
  middleware/             Request logging and centralized errors
  models/                 CartItem and Favorite Mongoose schemas
  routes/apiRoutes.js     REST endpoints
  services/               Product catalogue provider
test/                     HTTP/API tests with in-memory model doubles
```

## Run locally

1. Use Node.js 20 or newer and MongoDB Atlas or a local MongoDB instance.
2. Copy `.env.example` to `.env`, then set `MONGODB_URI` to your own database connection string. Never commit `.env`.
3. From `Backend/`, run `npm ci`, then `npm run dev`.
4. Configure the frontend's `VITE_API_BASE_URL` as `http://localhost:8080` (or omit it to use that default).

When run locally or on Render, the server does not listen until its MongoDB connection succeeds. On Vercel, the exported Express app connects to MongoDB when a cart or favorites route is requested; product and health routes do not need MongoDB. `PORT` defaults to `8080`. `CORS_ORIGIN` is a comma-separated allowlist; when omitted, all origins are allowed for local development. Set the exact deployed frontend origin(s) in production.

## API

Interactive documentation: `GET /api-docs/`  
Raw OpenAPI document: `GET /openapi.json`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/products` | List catalogue products |
| GET | `/products/:category` | Filter catalogue products by category |
| GET | `/products/categories` | List catalogue categories |
| POST | `/api/cart` | Add `{ "product": { ... }, "quantity": 1 }` to cart |
| GET | `/cart` | Get cart products with `quantity` |
| PUT | `/api/cart/:productId` | Set cart quantity using `{ "quantity": 2 }` |
| DELETE | `/api/cart/:productId` | Remove a cart product |
| POST | `/api/favorites` | Add `{ "product": { ... } }` to favorites |
| GET | `/favorites` | Get favorite products |
| DELETE | `/api/favorites/:productId` | Remove a favorite |

Cart/favorite endpoints accept an optional `X-User-Id` header (1-64 letters, numbers, `.`, `_`, `:`, or `-`). Requests without it use the `guest` collection. The frontend creates a persistent browser guest ID and sends it automatically. This is a partition key only, **not authentication**; do not treat it as authorization for private customer data or deploy sensitive user operations without real authentication.

Product inputs are allow-listed and validated (id, title, price, category, image URL, description, rating, and quantity); oversized JSON is rejected. Cart additions are atomic and unique per user/product, with a maximum quantity of 99; duplicate favorites do not create duplicate documents. Errors use HTTP status codes and a JSON `{ "success": false, "message": "..." }` response.

## Tests and logs

Run `npm test` from `Backend/`. The tests cover the HTTP routes, catalogue responses, cart/favorite writes, invalid input, and Swagger/OpenAPI availability without requiring MongoDB or network access. Runtime logs include each method, path, status, and duration; application and startup failures are logged separately.

## Deploy

### Vercel

Deploy the backend and frontend as separate Vercel projects from the same Git repository:

1. For the backend project, set the Root Directory to `Backend`. Vercel detects the Express app exported from `index.js`.
2. Set `MONGODB_URI` to the Atlas connection string and `CORS_ORIGIN` to the exact deployed frontend origin. `PRODUCTS_API_URL` is optional.
3. Deploy and verify `/`, `/products`, and `/api-docs/` on the backend domain.
4. For the frontend project, set the Root Directory to `Frontend`, Framework Preset to Vite, build command to `npm run build`, and output directory to `dist`.
5. Set the frontend's `VITE_API_BASE_URL` to the backend Vercel domain, then redeploy the frontend.
6. Ensure MongoDB Atlas Network Access allows connections from the backend's outbound network.

### Render

`render.yaml` defines a Render web service and enables automatic deploys from the connected Git repository. In Render:

1. Connect the GitHub repository and create a Blueprint from `Backend/render.yaml`.
2. Add the MongoDB Atlas connection string as the private `MONGODB_URI` environment variable.
3. Set `CORS_ORIGIN` to the exact public frontend URL and allow the Render service's outbound IPs in the Atlas network access rules as appropriate.
4. Deploy, then confirm `/` and `/api-docs/` respond.
5. In Netlify (or Vercel), connect the same GitHub repository, use `Frontend` as the base directory, `npm run build` as the build command, and `dist` as the publish directory. Set `VITE_API_BASE_URL` to the deployed Render API URL and redeploy. The frontend config in `Frontend/netlify.toml` handles client-side route fallback on Netlify.

Cloud resources and their credentials must be created in the owner's accounts; they are not provisioned by this repository.

## Interview walkthrough

- **Purpose and flow:** The storefront fetches the catalogue through Express. Cart and favorites go through route → controller validation → Mongoose model → MongoDB → JSON response.
- **Data model:** Cart and favorite documents store a user/session key, product id, validated product snapshot, and timestamps; cart items also store a bounded quantity. Compound unique indexes prevent duplicate products per guest/session.
- **Reliability:** Server startup fails explicitly if MongoDB is not configured/reachable; requests are size-limited, validated, logged, and return meaningful HTTP errors. Product catalogue failures return `502`.
- **Trade-offs and next steps:** The catalogue provider is external and guest IDs are not secure authentication. A production system should add authenticated identities, authorization, a first-party product collection/admin flow, rate limiting, monitoring, and payment/order workflows. MongoDB atomic updates handle individual cart additions; multi-document order/payment flows would need transactions and idempotency.
