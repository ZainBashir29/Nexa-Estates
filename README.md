# Nexa Estates

Nexa Estates is a real-estate listing app for Sheikhupura, Pakistan. Browse properties with filters or search in plain language; the API translates natural-language queries into listing criteria.

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose)
- Natural-language search: Groq API

## Setup

Prerequisites: Node.js, MongoDB, and a Groq API key.

1. Install dependencies in both projects:

   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Create `backend/.env` with:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017
   GROQ_API_KEY=your_groq_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

   The backend appends the `nexa-estates` database name to `MONGODB_URI`. `PORT` is optional and defaults to `3000`.

3. Start the API and frontend in separate terminals:

   ```sh
   cd backend && npm run dev
   ```

   ```sh
   cd frontend && npm run dev
   ```

   Open the local URL printed by Vite. Its development server proxies `/api` requests to `http://localhost:3000`.

## API

- `GET /api/health` — health check
- `GET /api/listings` — search listings with structured filters
- `GET /api/listings/search?q=...` — natural-language listing search

The frontend can also be built with `cd frontend && npm run build`.
