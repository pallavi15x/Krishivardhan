# KrishiVardhan 🌾

A premium tech-enabled agrarian platform connecting farmers directly with consumers.

## Core Features
- **Direct Marketplace**: Browse, buy, and sell fresh local agricultural produce.
- **AI Advisory Support**: Diagnostic disease checking, weather intelligence, and crop planners.
- **Smart Logistics**: Cold storage reservations and shared transportation bookings.

## Setup & Running
1. Install dependencies: `npm install`
2. Start local development server: `npm run dev`

## Project Structure
```text
Krishivardhan/
├── src/
│   ├── components/       # Shared UI components
│   │   ├── Footer.jsx
│   │   ├── Helpers.jsx
│   │   ├── Hero3D.jsx
│   │   ├── Nav.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProfitCalculator.jsx
│   ├── pages/            # View components & forms
│   │   ├── Assistant.jsx
│   │   ├── Auth.jsx
│   │   ├── CartView.jsx
│   │   ├── ColdStorage.jsx
│   │   ├── Community.jsx
│   │   ├── CropPlanner.jsx
│   │   ├── Disease.jsx
│   │   ├── FarmerCrops.jsx
│   │   ├── FarmerDashboard.jsx
│   │   ├── FarmerEarnings.jsx
│   │   ├── FarmerOrders.jsx
│   │   ├── FarmerProfile.jsx
│   │   ├── Home.jsx
│   │   ├── Marketplace.jsx
│   │   ├── MyOrders.jsx
│   │   ├── Queries.jsx
│   │   ├── Schemes.jsx
│   │   ├── Transport.jsx
│   │   ├── Weather.jsx
│   │   └── WishlistView.jsx
│   ├── utils/            # Local storage polyfill
│   │   └── storage.js
│   ├── App.jsx           # Main routing & state
│   ├── index.css         # Animated background styles
│   └── main.jsx          # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```
