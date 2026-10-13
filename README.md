# Giftify — personalised gifting storefront

A responsive, brown-and-cream gifting storefront built with **Vite + vanilla JavaScript** and an **Express API**. Designed to be beginner-friendly and easy to push to GitHub.

## Features

- Responsive editorial-style storefront
- Six gift categories and product cards
- Live search and category filters
- Shopping bag with quantity controls and saved cart (`localStorage`)
- Favourites saved in the browser
- Custom-gift enquiry form connected to the Express API
- Newsletter signup connected to the Express API
- Demo checkout that records an order but **does not collect payment**
- API health endpoint
- Mobile navigation and accessible labels

## Requirements

- Node.js 18 or newer (Node 20 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

The Vite preview is at the URL printed by Vite (usually `http://localhost:5173`). The API-backed forms require the Express server too. In a second terminal:

```bash
npm start
```

Then open **http://localhost:3000** to use the complete app (the server serves the built frontend). For API forms to work during Vite development, either build and use the Express-served app or add a Vite proxy in `vite.config.js`.

## Build

```bash
npm run build
npm start
```

## Push to GitHub

1. Create a new empty repository on GitHub named `giftify` (do not add a README if you already have one).
2. In this folder, open a terminal and run:

```bash
git init
git add .
git commit -m "Build Giftify gifting storefront"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/giftify.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Deployment notes

**GitHub Pages only hosts static files**; it will not run the Express backend. To host the frontend on GitHub Pages, use `npm run build` and deploy the `dist` directory using GitHub Actions or the Pages settings. Backend-dependent forms need a separately hosted API (for example, Render, Railway, or another Node hosting provider), and the frontend's API base URL must then be configured for that deployment.

To deploy the **complete app**, deploy this repository to a Node-compatible hosting provider that supports `npm install`, `npm run build`, and `npm start`. Set `PORT` if the host requires it.

## Before taking real orders

This is a functional prototype, not a production commerce system. Before launch:
- Replace demo checkout with a real payment provider (for example, Razorpay or Stripe) using server-side payment verification.
- Store products, orders, newsletter subscribers, and custom requests in a database (PostgreSQL/Supabase, for example), not local JSONL files.
- Add admin authentication and an order-management dashboard.
- Configure delivery rates, inventory, cancellation/refund policy, privacy policy, terms, and customer support.
- Validate price and product IDs on the server; never trust totals sent by the browser.
- Set strict CORS and security headers for your production domain.
- Add email confirmation and spam protection.
- Replace sample images and contact placeholders with your own licensed assets and real business details.

## API routes

- `GET /api/health` — health check
- `GET /api/products` — API/catalogue placeholder
- `POST /api/custom-requests` — validates and stores custom enquiries in `data/custom-requests.jsonl`
- `POST /api/newsletter` — validates and stores newsletter emails in `data/newsletter.jsonl`
- `POST /api/orders/demo` — records a demo order in `data/demo-orders.jsonl`; **no payment is taken**

Generated `data/` records are local runtime data and are not intended as a production database.
