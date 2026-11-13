# Public deployment checklist

You asked for both a downloadable source-code project and a live website. The ZIP contains the complete runnable project. A live public URL cannot be issued until the project is deployed under a hosting account you control.

## Backend on Render
1. Create a GitHub repository and upload this project.
2. In Render, create a **Web Service** connected to the repository.
3. Set **Root Directory** to `server`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `GEMINI_API_KEY` = your Gemini key (optional)
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `CORS_ORIGIN` = your Vercel frontend URL after it is created
7. Copy the deployed backend URL, e.g. `https://your-api.onrender.com`.

## Frontend on Vercel
1. Import the same GitHub repository in Vercel.
2. Set **Root Directory** to `client`.
3. Framework preset: Vite.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable `VITE_API_URL` = your Render backend URL.
7. Deploy and copy the Vercel URL.

## Final connection
Set `CORS_ORIGIN` on Render to your Vercel URL, then redeploy/restart the backend. Open the Vercel URL and test a sample trip.

Do not share your Gemini API key publicly. Do not commit `.env` files.
