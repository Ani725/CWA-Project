# CWA-Project

Frontend-only e-commerce capstone project built with React and Vite.

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
- Add your team members here.

License
- Add license or project notes here.