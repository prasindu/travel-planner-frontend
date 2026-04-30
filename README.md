# Lanka Trails — Travel Planner Frontend

React + Vite + Tailwind CSS frontend for the Sri Lanka Travel Planner backend.

## Setup

```bash
npm install
npm run dev
```

> Backend (Express) port 5000 on run කරලා තිරෙන්න ඕනෙ.
> Vite proxy `/api` → `http://localhost:5000` forward කරනවා.

## Pages / Steps

| Step | Page | Backend Route |
|------|------|---------------|
| 1 | Search & Suggestions | `POST /api/suggestions` |
| 2 | Plan & Arrange | (local state) |
| 3 | Optimize Route | `POST /api/optimize` |
| 4 | Full Itinerary | `POST /api/itinerary` |

## Features

- City search → Google Places tourist attractions with photos
- Drag/reorder selected places
- Start time picker
- Google Directions route optimization
- Itinerary: Bus (MongoDB) / Train / Car tabs per segment
- Animated loading states
- Mobile responsive

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Axios
- Lucide React icons
