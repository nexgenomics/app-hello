# NexGenomics — Customer App Project Instructions

This project builds and maintains **nexgenomics/app-hello**, a customer application on the
NexGenomics Trusted AI Infrastructure Fabric. The app consumes the shared
`@nexgenomics/core` package; it does not reimplement the platform.

- **Customer:** NexGenomics
- **Brand:** Hello AI
- **App repo:** `nexgenomics/app-hello`
- **Core version (pinned):** `@nexgenomics/core@1.0.0`

## What you are working on

A standalone React/TypeScript SPA cloned from `nexgenomics/app-template`. It is a
clean re-skin of the template, not a fork of the platform. All shared
behaviour — auth, theming, API client, UI primitives — comes from
`@nexgenomics/core` at the pinned version above.

## The inviolable core contract (these are enforced as required CI checks)

These are not style preferences; each is a merge-blocking check on every PR.
Working around them locally only defers the failure to CI.

1. **Pin core exactly.** `@nexgenomics/core` must read `1.0.0` — never
   `*`, a range (`^`/`~`), `file:`/`link:`, `workspace:`, or a git URL. Upgrading
   is a deliberate act: bump the pin, let CI re-verify. (check: `core-pin`)
2. **Import only declared exports.** Use `@nexgenomics/core/ui`, `/auth`,
   `/config`, `/theme`, `/brand`, `/api`, `/lib`. Never reach into
   `@nexgenomics/core/src/...`. (check: `no-deep-imports`)
3. **Keep the `@source` line** in `src/index.css`
   (`@source '../node_modules/@nexgenomics/core/src'`). Without it the app builds
   green but renders completely unstyled. (check: `styling-assert`)
4. **Never commit a registry token.** `.npmrc` carries only the scope line and
   `_authToken=${NODE_AUTH_TOKEN}`; the real token comes from the environment.
   (checks: `check-npmrc-token`, `check-no-secrets`)
5. **Don't own the auth provider or token cache.** Wrap the app in core's
   `<AuthProvider>`; never stand up your own `Auth0Provider`, never set
   `cacheLocation`, and never persist a token to `localStorage`/`sessionStorage` —
   the in-memory-token posture lives in `@nexgenomics/core/auth`. Using
   `useAuth0()` for login/logout/auth-state is fine. (check: `auth-posture`)
6. **Call the gateway only through core's typed client.** No raw
   `fetch`/`axios`/XHR to a `/v1` path; use `@nexgenomics/core/api` (`useFabApi`),
   which injects the bearer. (check: `no-raw-gateway`)
7. **This is a frontend app.** No Go sources and no server framework in the repo;
   custom compute is the agent / ISV track, not a service smuggled in here.
   (check: `frontend-only`)

## Where you may diverge (the brand surface)

Re-skinning lives in exactly three places — change these, nothing else:
`src/brand/brand.ts`, `src/brand/tokens.css`, and `public/brand/*`. Keeping
brand-specific values confined here is what makes this a clean re-brand rather
than a fork. The full authoring contract — what divergence is permitted beyond
brand, and how — is the separate authoring-contract document.

## Develop

    # one-time: a read:packages token in NODE_AUTH_TOKEN for GitHub Packages
    npm install
    npm run dev          # local dev server
    npm run ci           # typecheck + build + secrets scan (the gates CI enforces)

## CI

Every PR to `main` runs the shared reusable workflow (`ci / app-ci`): core-pin,
no-deep-imports, check-npmrc-token, auth-posture, no-raw-gateway, frontend-only,
typecheck, clean-clone build, check-no-secrets, and styling-assert. All must pass
before merge. The pipeline is single-sourced in the fleet — you do not edit it
here. The full statement of what these checks enforce, and where divergence is
permitted beyond brand, is the authoring-contract document.
