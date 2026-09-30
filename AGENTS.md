# Muse – Private AI Photo Journal

## Stack
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Server**: Express (`server.ts`) using Vite middleware in dev mode — `tsx server.ts` serves both API and frontend on port 3000
- **AI**: Google Gemini (`@google/genai`) for image-to-image stylization (`gemini-3.1-flash-image`)

## Running in Base44
- `docker compose -f docker-compose.base44.yml up -d` — single `web` service on port 3000
- Node 22 slim image, source bind-mounted at `/app`, deps installed via `npm install` on startup, `npx tsx server.ts` runs the dev server with HMR
- Health check: `GET /api/health` → `{ status: "ok", hasApiKey, appName }`

## Secrets
- `GEMINI_API_KEY` (optional): Without it the app boots and falls back to a client-side neural art engine; AI stylization (`/api/generate-style`) returns `fallbackRequired: true`. With it, photo stylization uses the Gemini image model.

## Key endpoints
- `GET /api/health` — status + API key presence
- `POST /api/generate-style` — image-to-image stylization (body: `imageBase64`, `mimeType`, `prompt`, `styleStrength`)

## Notes
- Vite config sets `base` from `BASE_PATH` env (defaults to `/`); `server.host: '0.0.0.0'` already configured
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed for preview host allowlisting
- App data (journal entries) is stored client-side in localStorage (`src/utils/storage.ts`)
