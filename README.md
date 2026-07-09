# Lanka Trails 🇱🇰 — Frontend

The web client for **Lanka Trails**, a smart trip-planning platform for exploring Sri Lanka. Search destinations, build a trip, get an optimized multi-modal route, track it live, and get automatic indoor alternatives when the weather turns bad.

> 🔗 Backend repo: [lanka-trails (API)](https://github.com/prasindu/travel-backend) — this app talks to it over REST.

## ✨ Features

- **Destination Search** — Search any city or place and browse the top matching attractions (ratings, photos, address, open-now status).
- **Trip Builder** — Pick places from search results and assemble a custom multi-stop trip.
- **Route Optimization** — One click reorders your stops into the shortest route (round-trip or fixed end location).
- **Multi-Modal Directions** — See bus, train, and car options for every leg of the trip, with timings, terminals, and estimated cost.
- **Live Trip Tracking** — Start a trip and follow real-time progress notifications as you move between stops.
- **Weather-Aware Alternatives** — Automatically shows nearby indoor alternatives when bad weather is detected at an outdoor stop.
- **User Accounts** — Register/login (JWT), change password, and view saved trip history.
- **AI Chat Widget** — In-app assistant for trip questions and help.
- **Multi-Language Support** — UI translations via a language context/provider.

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **HTTP Client:** Axios
- **Auth:** JWT stored client-side, sent as `Authorization: Bearer <token>`
- **Maps/UI:** Google Maps / Places JS (for map & place UI, if used)

## 📁 Project Structure

```
travel-planner-frontend/
├── public/
│   ├── pngwing.com(1).png
│   └── video.mp4
├── src/
│   ├── api/
│   │   └── index.js           # Axios instance + API calls (auth, trips, search, directions, weather)
│   ├── components/
│   │   ├── AIChatWidget.jsx
│   │   ├── Navbar.jsx
│   │   └── SaveTripModal.jsx
│   ├── context/
│   │   └── LanguageContext.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ItineraryPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── OptimizePage.jsx
│   │   ├── PlanPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SearchPage.jsx
│   │   └── TripActivePage.jsx
│   ├── translations.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## ⚙️ Setup

**Clone & install**

```bash
git clone https://github.com/prasindu/travel-planner-frontend.git
cd travel-planner-frontend
npm install
```

**Environment variables** — create a `.env` file in the root:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

**Run the dev server**

```bash
npm run dev
```

App runs on `http://localhost:5173` by default.

**Build for production**

```bash
npm run build
npm run preview
```

## 🔌 Connecting to the Backend

This frontend consumes the [Lanka Trails backend](https://github.com/prasindu) REST API. Make sure the backend is running (default `http://localhost:3000`) and `VITE_API_BASE_URL` points to it.

| Feature | Backend Endpoint |
|---|---|
| Register / Login | `POST /api/auth/register`, `POST /api/auth/login` |
| Profile / Password | `GET /api/auth/me`, `PUT /api/auth/password` |
| Destination Search | `POST /api/suggestions` |
| Route Optimization | `POST /api/optimize` |
| Directions | `POST /api/directions` |
| Full Trip Plan | `POST /api/trip-plan` |
| Saved Trips | `POST /GET /PATCH /DELETE /api/trips` |
| Weather Check | `POST /api/weather` |

Protected routes require an `Authorization: Bearer <token>` header — the token is issued on login/register and stored in the auth context (e.g. `localStorage`).

## 🧭 User Flow

1. Search a destination → browse top places.
2. Pick places to visit (search again to add more from other locations).
3. Hit **Optimize** → stops are reordered into the shortest route.
4. View bus / train / car options for each leg, with timings and costs.
5. Start the trip → get live progress notifications.
6. At outdoor stops, see automatic indoor alternatives if the weather is bad.
7. Save the completed trip to your account.

## 📝 Notes

- All data-fetching logic lives in `src/api/index.js` as thin Axios wrappers — keep components/pages free of raw `fetch`/`axios` calls where possible.
- Auth token expiry should redirect to `/login` via an Axios response interceptor.
- Match the backend's outdoor place types (parks, beaches, temples, zoos, campgrounds, natural features, tourist attractions) when deciding whether to show weather-based alternatives in the UI.

## 📄 License

Add your license here (MIT, ISC, etc.)