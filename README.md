## Overview
This project is a single-page React application that demonstrates a small e-commerce storefront using DummyJSON for product data. It implements product listing, product details, a shopping cart (client-side only), a simulated checkout flow, and order persistence in the browser.

## Features
 - Product listing fetched from DummyJSON (https://dummyjson.com)
 - Product detail page with images, description, rating and reviews
 - Shopping cart with add/remove and quantity management (persisted in `localStorage`)
 - Cart displayed as a slide-over panel (no separate cart page)
 - Search, category filter, price filter and sorting
 - User reviews (persisted in `localStorage` and merged with API data)
 - Full simulated checkout flow with shipping form, payment selection, GST (5%) and QST (9.975% for Quebec)
 - Exit-confirmation dialog on the Checkout page when attempting to leave (prevents accidental navigation)
 - Order confirmation page (orders persisted to `localStorage`)
 - Global cart synchronization across components via a `cartUpdated` CustomEvent
 - Responsive layout using plain CSS (`src/styles/App.css`)

## Recent changes
 - Removed the separate `/cart` route and `CartPage` — cart is now managed via the slide-over `ShoppingCartPanel`.
 - Added an exit-confirmation dialog on the Checkout page. The dialog appears when the user attempts to leave checkout (logo click or search Enter) to avoid accidental loss of form data.
 - Improved cart synchronization across components by dispatching a `cartUpdated` CustomEvent whenever the cart is changed.

## Code cleanup
- Removed the now-unused `CartPage.jsx` and route to simplify navigation and rely on the cart slide-over panel.
- Replaced ad-hoc sessionStorage flag logic with explicit events: `applySearch` and `clearSearch` for consistent cross-component communication.
- Consolidated cart update handling through `cartUpdated` dispatched from `cartUtils.saveCart()` so components no longer duplicate storage listeners.
- Footer and Header now dispatch `headerLogoClick` so Checkout alone handles exit-confirmation behavior; this eliminates duplicate navigation handlers.

## Quick start
1. Install dependencies
```bash
npm install
```
2. Run development server
```bash
npm run dev
```

3. Build for production
```bash
npm run build
```

4. Preview production build locally
```bash
npm run preview
```

## Developer notes
 - LocalStorage keys:
	 - `cart` — serialized cart contents
	 - `reviews_v1` — locally posted reviews
	 - `orders_v1` — placed orders

 - Important custom events used for cross-component coordination:
	 - `cartUpdated` — dispatched when the cart is saved to keep badges and panels in sync.
	 - `headerLogoClick` — dispatched by the header when the logo is clicked; Checkout listens to this to display the exit-confirmation dialog.

 - Checkout behavior:
	 - If the cart is empty the Checkout route redirects to home.
	 - When leaving Checkout via the logo or by pressing Enter in the search box, a confirmation dialog appears with options to continue shopping or stay on checkout.
	 - The cart panel (slide-over) is used for inspecting/updating the cart — there is no separate cart page.

## Deployment (Vercel)
1. Push the repository to GitHub.
2. Import the repository into Vercel and use the default Vite settings.
	 - Build command: `npm run build`
	 - Output directory: `dist`

### Troubleshooting: page reloads / deep links on Vercel
If you see a Vercel 404 / error page when reloading a client-side route (for example `/checkout` or `/confirmation`), that's because Vercel by default serves static files and doesn't know to return your `index.html` for SPA routes. To fix this, add a `vercel.json` file at the project root with a rewrite to `index.html` (this repository includes it):

```json
{
	"rewrites": [
		{ "source": "/(.*)", "destination": "/index.html" }
	]
}
```

After adding `vercel.json`, redeploy on Vercel (the imported project will pick up the file automatically). Alternatively, if you cannot change server settings, use `HashRouter` in React Router so URLs include a `#/` and avoid server rewrites.

## Contributing / Team
 - Add your team members and contribution instructions here.

## License
 - Add license or project notes here.

---
If you'd like, I can add a short changelog file or a `CONTRIBUTING.md` with development conventions and testing instructions.

Features
- Product listing fetched from DummyJSON (https://dummyjson.com)
- Product detail page with images, description, rating and reviews
- Shopping cart with add/remove and quantity management (persisted in `localStorage`)
- Search, category filter, price filter and sorting
- User reviews (persisted in `localStorage` and merged with API data)
- Full simulated checkout flow with shipping form, payment selection, GST (5%) and QST (9.975% for Quebec)
- Order confirmation page (orders persisted to `localStorage`)
- Responsive layout using plain CSS (`src/styles/App.css`)

Quick start
1. Install dependencies
```
npm install
```
2. Run dev server
```
npm run dev
```

Build & preview
```
npm run build
npm run preview
```

Notes
- This is a frontend-only application. No real payments are processed; payment methods are simulated.
- Reviews and cart are persisted in the browser `localStorage` under keys `reviews_v1`, `cart`, and `orders_v1`.

Deployment (Vercel)
1. Create a GitHub repository and push the project.
2. Sign in to Vercel and import the repository.
3. Use the default Vite settings; build command `npm run build` and output directory `dist`.

Team
- Shanley Aninzo
- Rohina Sultani

Link to Vercel Deployment
https://cwa-project.vercel.app/ 

