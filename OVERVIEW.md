# Apna Deera Restaurant — Project Overview

## Website identity
The supplied Apna Deera gold logo is used in the navigation header. The layout reference is followed with a luxury warm-ivory background, dark-brown typography, refined gold accents, a large food hero image, featured menu cards and clear reservation/order calls to action.

## Main pages / sections
1. **Home** — restaurant hero, key promises and menu highlights.
2. **About Us** — restaurant introduction and dining image.
3. **Menu** — Desi, Fast Food, Sides, Desserts and Drinks categories; item names, descriptions, PKR sample prices and food photos.
4. **Gallery** — food photography grid.
5. **Reviews** — sample testimonials and a form to submit a review.
6. **Reservation** — date, time, guest count and contact form.
7. **Contact** — restaurant contact details and message form.
8. **Cart & Checkout** — add/remove items, update quantities, delivery details and payment-method selection.
9. **Admin Dashboard** — order status management, reservation list, contact messages, reviews and summary cards.

## Order workflow
A customer adds menu items to the cart and submits delivery details. The backend saves the order with status **Pending** and payment status **Pending**. The admin can update an order to **Pending**, **Preparing**, **Out for delivery**, **Delivered** or **Cancelled**. The order API also provides a customer order-list endpoint for a future account order-history screen.

## Backend
The Express API handles menu data, customer registration/login, order creation, admin order updates, reservations, contact messages and reviews. For easy project demonstration, data is persisted in `server/data.json`.

## Local run
```bash
npm install
npm run dev
```
Open `http://localhost:5173`. The API runs on port `4000`.

## Before deployment
- Restaurant phone / WhatsApp: `03021360530`
- Restaurant address: `Devri Road, Ghotki`
- Replace the demo email in `client/src/App.jsx` with a monitored address.
- Confirm every menu price and photograph against the real restaurant menu.
- Set a strong admin password and JWT secret using `.env` (see `.env.example`).
- Deploy to a Node.js host with persistent storage, not static-only hosting.
- Integrate a merchant-approved payment gateway before advertising JazzCash, Easypaisa, Raast or card payments as completed online payments.

## Payment limitation
The project offers the requested payment choices in checkout, but external methods are recorded as pending only. It does not process or verify money transfers. Real payments need provider merchant credentials, secure server integration and payment callbacks/webhooks.
