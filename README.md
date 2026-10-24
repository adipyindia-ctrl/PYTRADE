# PYTRADE — Indian Stock Trading Platform

A premium, fully responsive Indian stock trading demo platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, MongoDB, NextAuth v5, Recharts, and Redux Toolkit.

> ⚠️ **Demo Only** — All market data, prices, holdings, orders, and balances are simulated. No real trades, payments, KYC verification, or financial transactions are performed.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — landing page  
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — trading dashboard (requires login)

### Build & Type-check

```bash
npm run build     # production build (exit 0, 63 pages)
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript strict check
```

### Demo Credentials

1. Go to `/signup` and create an account
2. OTP verification: use `123456` (demo mode — no real SMS sent)
3. Or use any previously created account at `/login`

---

## Complete Route Inventory

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/welcome` | Onboarding splash screen |
| `/login` | Sign in |
| `/signup` | Create account (mobile/email tabs) |
| `/verify-otp` | OTP verification (demo OTP: 123456) |
| `/set-password` | Password + 6-digit PIN setup |
| `/account-activated` | Account creation success |

### Protected App Routes (require login)
| Route | Description |
|-------|-------------|
| `/dashboard` | Full trading dashboard |
| `/markets` | Stock screener with search, sector filters, sort |
| `/stocks/[symbol]` | Stock detail (20 static paths: RELIANCE, TCS, INFY…) |
| `/orders/new` | Place buy/sell order |
| `/orders/[orderId]` | Order confirmation |
| `/orders` | Order book (Open/Executed/Cancelled tabs) |
| `/watchlist` | Watchlist management |
| `/portfolio` | Holdings, P&L, allocation chart |
| `/funds` | Funds overview + balance |
| `/funds/add` | Add funds (UPI/Net Banking/Card — demo) |
| `/funds/success` | Payment success screen |
| `/funds/withdraw` | Withdraw funds |
| `/funds/withdraw/success` | Withdrawal submitted screen |
| `/transactions` | Full transaction history |
| `/kyc` | 5-step KYC wizard (PAN → Aadhaar → Personal → Bank → eSign) |
| `/bank-accounts` | Link and manage bank accounts |
| `/ipo` | IPO listings with apply flow |
| `/profile` | Profile, security, notifications, price alerts, support |

### API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth v5 handler |
| `/api/auth/signup` | POST | Create account (bcrypt hashed) |
| `/api/auth/send-otp` | POST | Issue demo OTP challenge |
| `/api/auth/verify-otp` | POST | Verify OTP (max 3 attempts, 5 min TTL) |
| `/api/kyc/update` | POST | Save KYC progress to MongoDB |
| `/api/banks/add` | POST | Save bank account to MongoDB (masked) |

---

## Complete Demo Workflows

### Onboarding
`/` → `/welcome` → `/signup` → `/verify-otp` (OTP: 123456) → `/set-password` → `/account-activated` → `/dashboard`

### Trading
`/markets` → `/stocks/RELIANCE` → Buy/Sell panel → `/orders/new` → Review modal → `/orders/ORD...` → `/orders`

### Portfolio
`/portfolio` → Holdings table + allocation pie + performance chart → `/stocks/[symbol]`

### Funds — Add
`/funds` → `/funds/add` → Select amount + method → Demo payment → `/funds/success` → `/transactions`

### Funds — Withdraw
`/funds/withdraw` → Select bank → Review step → Confirm → `/funds/withdraw/success` → `/transactions`

### KYC
`/kyc` → PAN (format: ABCDE1234F) → Aadhaar (demo OTP: 123456) → Personal Details → Bank Account → Documents → Complete

### Profile
`/profile` → Personal Info / Bank Accounts / KYC Status / Security / Notifications / Price Alerts / Refer & Earn / Help & Support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts (AreaChart, PieChart, LineChart) |
| State | Redux Toolkit (6 slices) |
| Auth | NextAuth v5 (Credentials + JWT) |
| Database | MongoDB Atlas + Mongoose |
| Forms | React Hook Form + Zod v4 |

---

## Redux Store Slices

| Slice | State | Actions |
|-------|-------|---------|
| `watchlist` | `WatchlistItem[]` | addToWatchlist, removeFromWatchlist, toggleWatchlist |
| `orders` | `Order[]` | placeOrder, cancelOrder |
| `bank` | `LinkedBank[]` | addBank, removeBank, setPrimaryBank |
| `funds` | `balance, transactions[]` | addFunds, requestWithdrawal |
| `ipo` | `applications[]` | applyIPO |
| `priceAlerts` | `alerts[]` | addAlert, removeAlert, toggleAlert |

---

## Design System

Brand tokens in `globals.css` via Tailwind v4 `@theme`:

| Token class | Value | Usage |
|-------------|-------|-------|
| `pytrade-blue` | `#0866F5` | Primary actions, active nav, links |
| `pytrade-navy` | `#101B3D` | Headings, sidebar, body text |
| `positive` | `#16A34A` | Price gains, success states |
| `negative` | `#DC2626` | Price losses, errors |
| `page-bg` | `#F5F7FB` | App background |

---

## Responsive Breakpoints

| Viewport | Layout |
|----------|--------|
| 320–767px | Mobile: single column, bottom nav, compact header |
| 768–1023px | Tablet: collapsible sidebar, 2-col grids |
| 1024px+ | Desktop: persistent sidebar, multi-col dashboard |

---

## Project Structure

```
src/
├── app/                    # All Next.js routes
│   ├── (auth)/             # Shared auth layout
│   ├── api/                # API route handlers
│   ├── dashboard/          # Trading dashboard
│   ├── markets/            # Stock screener
│   ├── stocks/[symbol]/    # Stock detail
│   ├── orders/             # Order book + new order
│   ├── portfolio/          # Holdings & P&L
│   ├── funds/              # Add/withdraw funds
│   ├── transactions/       # Transaction history
│   ├── kyc/                # KYC wizard
│   ├── bank-accounts/      # Bank linking
│   ├── ipo/                # IPO listings
│   ├── profile/            # Settings & profile
│   ├── welcome/            # Onboarding splash
│   ├── signup/             # Account creation
│   ├── verify-otp/         # OTP verification
│   ├── set-password/       # Password + PIN
│   ├── account-activated/  # Activation success
│   ├── login/              # Sign in
│   └── watchlist/          # Watchlist management
├── components/
│   ├── ui/                 # Button, Badge, Card, Modal, Skeleton…
│   ├── layout/             # AppLayout, DesktopSidebar, MobileBottomNav…
│   ├── charts/             # MiniChart, PortfolioChart, ResponsiveChart
│   └── landing/            # Landing page sections
├── features/
│   ├── dashboard/          # 7 dashboard feature components
│   └── search/             # GlobalStockSearch, MobileSearchOverlay
├── mocks/                  # Typed demo data (indices, stocks, holdings, orders, news, ipos)
├── types/                  # Shared TypeScript interfaces
├── lib/                    # formatters, calculations, chartData, utils
├── config/                 # Navigation config
├── store/                  # Redux store + 6 slices
└── server/
    ├── auth.ts             # NextAuth v5 config
    ├── db/mongoose.ts      # MongoDB connection
    └── models/             # User, OtpChallenge Mongoose models
```

---

## Security Notes

- Passwords hashed with bcrypt (cost 12) — never stored plain
- OTPs hashed with bcrypt, 5-minute TTL, max 3 attempts
- Route middleware protects all app routes — unauthenticated users redirected to /login
- No Aadhaar, PAN, card numbers, or bank credentials stored
- Account numbers masked (XXXXXXXX1234) after entry
- MongoDB URI and secrets in `.env.local` — never exposed to client

## Future Integration Points

- Real SMS/OTP delivery via Twilio or MSG91 (replace `/api/auth/send-otp`)
- Real KYC via Digilocker / UIDAI API
- Real payment gateway (Razorpay, PayU)
- Real broker API for live prices and order execution
- WebSocket for real-time price updates
- MongoDB-persisted portfolio and order state (currently Redux session-only)

---

## Disclaimer

PYTRADE is a **demonstration application only**. It is not affiliated with SEBI, NSE, BSE, or any registered broker. All market data, prices, holdings, and balances are fictional simulations for UI demonstration purposes only.
