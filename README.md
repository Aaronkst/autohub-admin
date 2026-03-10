# AutoHub Admin

Admin dashboard for AutoHub — built with React, TypeScript, Vite, and shadcn/ui.

## Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Framework    | React 19 + TypeScript                  |
| Build        | Vite 7                                 |
| Styling      | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| State        | Zustand (with Immer middleware)         |
| HTTP Client  | Axios                                  |
| Routing      | React Router DOM v7                    |
| Font         | Geist Variable                         |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### Install & Run

```bash
npm install
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/
│   ├── auth.ts            # 2-step login (OAuth token → user login)
│   └── instance.ts        # Axios instance with auto token management
├── components/
│   └── ui/                # shadcn/ui components (button, card, dialog, input, label, table, sonner)
├── lib/
│   ├── app-store.ts       # Zustand global state (user)
│   └── utils.ts           # Utility helpers (cn)
├── pages/
│   ├── LoginPage.tsx      # Login page with KBZPay 2-step auth
│   ├── DashboardPage.tsx  # Dashboard (placeholder)
│   └── AdminManagementPage.tsx  # Admin user table + create modal
├── App.tsx                # Routes
├── main.tsx               # Entry point
└── index.css              # Tailwind + theme tokens
```

## Routes

| Path                | Page                  | Description               |
| ------------------- | --------------------- | ------------------------- |
| `/`                 | LoginPage             | Login with email/password |
| `/dashboard`        | DashboardPage         | Dashboard (placeholder)   |
| `/admin-management` | AdminManagementPage   | Admin user management     |

## Authentication Flow

Login uses a **2-step OAuth** flow via KBZPay APIs:

1. **Get access token** — `POST` to KBZPay OAuth endpoint with client credentials (Basic Auth)
2. **Login** — `POST` to AutoHub login endpoint with email/password + access token in header

On success, the JWT token is saved to `localStorage` and the user is redirected to `/dashboard`.

## Dev Proxy (CORS)

The Vite dev server proxies API requests to avoid CORS issues during local development:

| Local Path    | Proxied To                             |
| ------------- | -------------------------------------- |
| `/oauth-api`  | `https://uat-miniapp.kbzpay.com`       |
| `/login-api`  | `https://wap.kbzpay.com`              |
| `/kbz`        | KBZPay base (via instance.ts)          |

> **Note:** The proxy only works when the Vite dev server (`npm run dev`) is running.

## Scripts

| Command           | Description            |
| ----------------- | ---------------------- |
| `npm run dev`     | Start dev server       |
| `npm run build`   | TypeScript + Vite build|
| `npm run lint`    | Run ESLint             |
| `npm run preview` | Preview production build|

## License

Private — not for redistribution.
