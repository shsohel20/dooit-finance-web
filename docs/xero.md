# Xero (frontend)

The backend owns all Xero logic. Full architecture, flows and runbook:
`dooit-finance-api/docs/xero/DEVELOPER_GUIDE.md` (see §12 for this repo).

## Files
| File | Purpose |
|---|---|
| `app/dashboard/client/system-settings/xero/{page.js,actions.js}` | Settings route + server actions |
| `views/xero/index.jsx` | Connect / Sync Now / Disconnect card, status polling, error list |
| `app/auth/xero/{page.js,actions.js}` | Public sign-up landing + server actions |
| `views/auth/xero/index.jsx` | Pre-filled signup form + automatic sign-in |
| `auth.js` | NextAuth `xero` Credentials provider (redeems a one-time login code) |
| `components/login-form.jsx` | "Continue with Xero" button |
| `components/…/ClientSidebar.js` | System Settings → Xero entry |

## Conventions
- Calls go through server actions (`fetchWithAuth` / `BASE_URL`) so the JWT never reaches client code. Every action returns `{ ok, status, ...body }`.
- `/auth/*` is public in `middleware.js`, so `/auth/xero` works signed-out.
- On-mount effects that consume single-use secrets (`ticket`, `loginCode`) are guarded with a `useRef` — React StrictMode would otherwise burn them in dev.

## Entry points (`/auth/xero`)
| URL | Meaning |
|---|---|
| `/auth/xero` | Start the flow (also the Xero App Store launch URL) |
| `?ticket=…` | New visitor → pre-filled registration form |
| `?loginCode=…` | Returning client admin → signed in, redirected to `/dashboard/client` |
| `?error=…&message=…` | Cancelled / already registered / failed → retry |

## Config
- `NEXT_PUBLIC_API_BASE_URL` must end in `/api/v1/`.
- API side: `XERO_POST_CONNECT_URL` = `<web>/dashboard/client/system-settings/xero`, `XERO_SIGNUP_URL` = `<web>/auth/xero`.

## Try it
Run the API with `XERO_*` set (guide §5), `npm run dev` (port 8001), log in as a client admin → **System Settings → Xero**. For signup, sign out and use **Continue with Xero** on `/auth/login`.
