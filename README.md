# Partner site template

A brandable starter that consumes `@nexgenomics/core`. It ships sign-in (Auth0), a
themed shell, and one example authenticated call (`WhoAmI` →
`GET /v1/principals/me`) that proves the typed gateway client works end to end.

## The only files you edit to re-brand

- `src/brand/brand.ts` — name, two-tone wordmark, logo mark path, theme color.
- `src/brand/tokens.css` — the palette (`:root` light, `.dark` dark). Recolor here.
- `public/brand/*` — the mark, favicon, app icons, web manifest.
- `index.html` — document `<title>` and social meta.
- `vite.config.ts` — the dev port / served origin.

## What you must NOT fork

`@nexgenomics/core` — the shared, audited core: the auth posture (in-memory token,
refresh rotation, no localStorage), the typed client and its spec-parity gate,
config, theme logic, and the UI primitives. Every site consumes one audited copy.
Forking or reimplementing it is how a fleet of sites drifts and how a single
regression becomes a breach. Build your app surface in `src/`; leave core alone.

## Develop

From the workspace root (`fabric-web/`):

    npm install
    npm -w template run dev      # http://localhost:22002

For login to work, the served origin must be allow-listed in **three** places
(same contract as the edge checklist in `@nexgenomics/core/config`):

1. **Auth0 SPA app** — Allowed Callback URLs / Logout URLs / Web Origins.
2. **Gateway CORS** — `CORS_ALLOWED_ORIGINS` includes this origin.
3. **RGW landing bucket CORS** — only if this site performs in-browser uploads.

## Build

    npm -w template run ci       # typecheck + build + secret scan

## Make it yours

Replace `src/features/whoami` with your first real view. Add features under
`src/features/`. Use core's hooks and primitives:

    import { useFabApi } from '@nexgenomics/core/auth'
    import { Button, Card } from '@nexgenomics/core/ui'

## Develop (standalone clone)

This repo is self-contained — it is NOT a workspace member. Authenticate to
GitHub Packages (a `read:packages` token in `NODE_AUTH_TOKEN`), then:

    npm install
    npm run dev

`npm run ci` runs typecheck + build + the secrets scan, the same gates the
required-checks workflow enforces on every PR.
