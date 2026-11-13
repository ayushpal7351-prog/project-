# TripMate AI — AI Powered Trip Planner

A runnable full-stack starter project built with React (Vite), Express, and optional Google Gemini integration.

## Features
- Responsive trip-planning dashboard
- Trip form: origin, destination, dates, budget, interests, travellers
- Day-wise itinerary generation
- Budget breakdown and travel tips
- Saved trips in browser local storage
- Gemini integration when an API key is configured; a local demo itinerary works without a key

## Requirements
- Node.js 18+
- npm

## Run locally

### 1. Start the backend
```bash
cd server
npm install
cp .env.example .env
# Optional: add your Gemini API key to server/.env
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Start the frontend (in a second terminal)
```bash
cd client
npm install
npm run dev
```
Open the local URL printed by Vite (usually `http://localhost:5173`).

## Configure Gemini (optional)
Create a Gemini API key in Google AI Studio and place it in `server/.env`:
```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
```
Never put your API key in the React client or commit `.env` to Git.

## Deploy for a public website
This project is deployment-ready, but a public URL must be created from your own hosting account:
1. Push this folder to a GitHub repository.
2. Deploy `server` as a Node web service on Render. Set the root directory to `server`, build command `npm install`, start command `npm start`, and add `GEMINI_API_KEY` if you want live AI generation.
3. Deploy `client` on Vercel. Set the root directory to `client`, build command `npm run build`, output directory `dist`.
4. In the Vercel project settings, add `VITE_API_URL` with your Render service URL (no trailing slash), then redeploy.
5. In Render, allow your Vercel domain in `CORS_ORIGIN` (or leave it unset for the starter's permissive development configuration).

See `DEPLOYMENT.md` for a more detailed checklist.

## Important
This is a college-project starter, not a booking platform. Hotel and transport suggestions are illustrative; it does not make reservations or guarantee live prices/weather.
