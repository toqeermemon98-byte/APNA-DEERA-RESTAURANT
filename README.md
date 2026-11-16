# Apna Deera Restaurant — Full-stack starter

A responsive restaurant ordering website based on the supplied Apna Deera logo and Golden Fork-style layout reference. The visual theme uses the supplied Golden Fork reference: black, antique gold and elegant restaurant photography.

## Features
- Home, About Us, Menu, Gallery, Reviews, Reservation and Contact sections
- Desi food, fast food, sides, desserts and drinks (no BBQ category)
- Menu cards with named items, PKR prices and real food photography for biryani, handi, gulab jamun, drinks and club sandwich
- Category filtering, add-to-cart, quantity controls and checkout
- Customer registration and login
- Order placement and status tracking in the admin dashboard
- Admin dashboard with orders, reservations, contact messages, reviews and summary
- Reservation, contact and review forms saved through the backend
- Responsive layout and CSS animations
- JSON-file persistence for a simple local project setup

## Requirements
- Node.js 20 LTS or newer
- npm

## Run locally (Windows)
1. Extract the ZIP.
2. Open the extracted `apna-deera-restaurant` folder in VS Code.
3. Open Terminal in that folder.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173`.

The API runs on `http://localhost:4000`. The first server run creates `server/data.json` with the starter menu and empty orders.

## Admin login
Default local development credentials:
- Email: `admin@apnadeera.pk`
- Password: `ChangeThisAdminPassword!`

**Before publishing:** create a `.env` file based on `.env.example` and set a strong unique `ADMIN_PASSWORD` and `JWT_SECRET`. Never publish the default credentials.

## Production build
```bash
npm run build
npm start
```
The Express server serves the built frontend from `dist` and the API from `/api`. Deploy this as a Node.js web service (for example Render, Railway or a VPS). A static-only hosting service cannot run this Express backend. Set environment variables in the hosting dashboard.

## Important: payments
The checkout offers Cash on Delivery, JazzCash, Easypaisa, Raast / Bank Transfer and Debit / Credit Card as payment choices. IMPORTANT: non-COD choices are currently recorded as **Pending** only. This project does not yet initiate or verify a live payment. Real payment collection requires merchant accounts, provider-issued API credentials, server-side verification and provider webhook configuration. Never collect card numbers in the ordinary checkout form. Keep Cash on Delivery enabled until a gateway is fully integrated and tested.

## Before going live — customize these details
Search `client/src/App.jsx` for:
- `03021360530` — restaurant phone / WhatsApp
- `Devri Road, Ghotki` — restaurant address
- `hello@apnadeera.pk` — replace with a monitored email
- Opening hours and delivery service area

Food photos are served from public photo hosts and need an internet connection; the Club Sandwich image is bundled locally in `client/public/club-sandwich.png`. Confirm that each photo matches your final menu and replace any image URL you do not want to use. Prices are sample PKR prices for the project demo; confirm actual prices before accepting public orders.

## Data and security notes
This is a project-ready starter, not a hardened high-volume production platform. It stores data in `server/data.json`; use persistent disk storage or migrate to PostgreSQL/Supabase before scaling. Add rate limiting, HTTPS, backups, stronger session handling, order ownership checks and admin audit logs before a public launch. Do not delete `server/data.json` if you need to retain demo orders.


## Restaurant contact
- Phone / WhatsApp: 03021360530
- Address: Devri Road, Ghotki
- Email: toqeermemon24@gmail.com


### Food photo credits
- Chicken Handi: Miansari66, Wikimedia Commons, CC0 1.0 (public domain dedication): https://commons.wikimedia.org/wiki/File:Chicken_Handi.JPG
- Club Sandwich: Memm, Wikimedia Commons, CC BY 3.0: https://commons.wikimedia.org/wiki/File:Club-sandwich.jpg
