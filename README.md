# RWA-SAMK Frontend

React + Vite frontend for calling a separately deployed FastAPI model backend.

## Configure backend URL

Create `.env.local` for local development:

```env
VITE_API_URL=https://YOUR-BACKEND-URL
```

The backend is expected to expose:
- `GET /health`
- `POST /predict` accepting a JSON object

Do not put private keys, passwords, or API secrets in `VITE_*` variables. They are exposed in the browser bundle.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Upload/push this project to a GitHub repository.
2. Import that repository in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable `VITE_API_URL` with your deployed backend base URL.
7. Deploy.

After changing the environment variable, trigger a new deployment.

The backend must allow your Vercel domain through its CORS configuration. Replace the sample JSON in `src/App.jsx` with your model's actual API input schema before testing predictions.
