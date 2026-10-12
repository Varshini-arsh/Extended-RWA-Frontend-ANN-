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

## Hedera ZK investor onboarding demo

The home page links to `/zkp-demo/`, a standalone wallet-connected demo for
the V5 zero-knowledge eligibility flow and ERC-3643 token contracts on
Hedera Testnet. It is served from `public/zkp-demo/` and does not change the
ANN `/predict` request or require a new Python API endpoint.

The demo uses MetaMask, calls the deployed contracts directly, and includes
three public sample proofs. These are testnet demo proofs; each nullifier can
only be used once. Before publishing a redeployed version, update the
addresses in `public/zkp-demo/index.html` and verify them on HashScan.
