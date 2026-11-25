# SkyTrip — AI-Powered Personalized Travel Planner & Companion

<div align="center">
  <img src="./public/logo.svg" alt="SkyTrip Logo" width="100" height="auto" />
  <h2>✈️ SkyTrip — AI-Powered Travel Planner</h2>
  <p><strong>End-to-end intelligent itinerary generation, route optimization, accessible travel planning, and offline-resilient trip companion tools.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js%2015-000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Groq_%2B_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Groq and Gemini AI" />
    <img src="https://img.shields.io/badge/Clerk%20Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    <img src="https://img.shields.io/badge/Convex-000?style=for-the-badge&logo=convex&logoColor=white" alt="Convex" />
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  </p>

  <img src="./public/thumbnail2.png" alt="SkyTrip AI Travel Planner Overview" width="100%" />
</div>

---

## 🎯 Problem Statement & Objectives

### Root Challenge
Modern travelers waste hours juggling fragmented browser tabs—switching between hotel aggregators, map tools, currency converters, timezone calculators, festival calendars, and travel blogs—only to end up with poorly sequenced routes, unexpected costs, and plans that fail when connectivity drops.

### Target User Needs
- **Personalized & Budget-Aligned Planning**: Tailored itineraries for solo travelers, couples, families, and groups across Low, Medium, and High budget tiers.
- **Geographically Logical Routing**: Sequential day-by-day routes (`Hotel → Activities → Hotel`) that minimize transit fatigue and back-tracking.
- **Real-Time Multi-Utility Companion**: Integrated currency conversion, destination timezone comparisons with sociable calling-hour warnings, and local cultural event discovery.
- **Inclusive, Accessible & Offline-Resilient Experience**: WCAG 2.1 AA keyboard/screen-reader navigation, reduced-motion support, accessibility notes in itineraries, offline fallback calculations, and QR-linked printable PDF travel guides.

### Core Objectives & Solution Mapping
| Objective | Implementation in SkyTrip |
| :--- | :--- |
| **Conversational Guided Planning** | Multi-turn AI intake (`app/api/aimodel/route.ts` + `chatbox.tsx`) collecting origin, destination, group size, budget, duration, interests, and accessibility needs. |
| **Reliable Multi-Provider AI** | Fast Groq (`openai/gpt-oss-20b`) primary inference with automatic JSON extraction/recovery and Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`) fallback (`lib/ai-helpers.ts`). |
| **Interactive Spatial Routing** | `GlobalMap.tsx` plots hotels, numbered activities, polylines per day, and nearby essentials (`Restaurants`, `ATMs`, `Hospitals`, `Metro`, `EV Charging`) via Places API (New). |
| **Unified Companion Toolkit** | `TripPlannerAddon.tsx` & `/tools/converter` provide live ExchangeRate currency conversion, IANA timezone offset sliders, local events, and offline fallbacks (`lib/travel-utils.ts`). |
| **Context-Aware Assistant** | Floating `TripChatbot.tsx` backed by `/api/chat` answers budget, weather, hotel, and dining questions grounded in the user's saved trip JSON. |
| **Analytics, Exports & Persistence** | Convex reactive persistence (`convex/schema.ts`, `convex/tripDetail.ts`), `/dashboard` analytics, and `PrintTravelGuide.tsx` with QR codes for offline use. |
| **Security & Rate Protection** | Clerk authentication middleware (`middleware.ts`), Arcjet token-bucket rate limiting (`lib/arcjet.ts`), strict HTTP security headers (`next.config.ts`), and validated `/api/contact`. |

---

## 🛠️ Technology Stack

* **Framework**: Next.js 15 (App Router, API Routes)
* **Language**: TypeScript (`strict: true`, zero build/lint bypasses)
* **AI Engine**: Groq API + Google Gemini API fallback with resilient JSON parsing
* **Database**: Convex Serverless Database (`UserTable`, `TripDetailTable`)
* **Authentication**: Clerk Auth (`@clerk/nextjs`)
* **Maps & Places**: `@react-google-maps/api` + Google Places API (New)
* **Security**: Arcjet token-bucket rate limiting & HTTP security headers
* **Testing & CI**: Vitest, React Testing Library, jsdom, and GitHub Actions (`.github/workflows/ci.yml`)

---

## 🛡️ Accessibility, Security & Testing

- **Accessibility (WCAG 2.1 AA)**: Skip-to-main-content navigation link, semantic `<main>` and `<nav>` landmarks, `:focus-visible` focus rings, `prefers-reduced-motion` support, `role="dialog"` / `aria-modal="true"` modals with Escape handling, `role="tablist"` tabs, `aria-pressed` controls, and explicit `<label htmlFor>` bindings.
- **Security**: Clerk route protection on all private planner/dashboard routes, Arcjet token-bucket rate limiting on AI & contact APIs, server-side input sanitization (`validateContactSubmission`, `sanitizeMessages`), no committed secrets (`.env.example` template provided), and strict security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **Automated Testing**: 4 test suites (30 tests) covering domain utilities, AI response recovery, API route validation, and accessible UI interactions via `npm test`.

---

## 📂 Project Structure

```
├── .github/workflows/ci.yml         # Automated CI: typecheck, lint, and Vitest suite
├── __tests__/                       # Vitest unit, API route, and component tests
├── app/
│   ├── api/
│   │   ├── aimodel/route.ts         # Guided trip questionnaire & itinerary generator
│   │   ├── chat/route.ts            # Context-aware trip assistant API
│   │   ├── contact/route.ts         # Validated & rate-limited contact inquiry API
│   │   ├── google-place-detail/     # Places API (New) photo lookup
│   │   ├── health/route.ts          # Service health & capability check
│   │   └── trip-addon/route.ts      # Currency, timezone, tips & events API
│   ├── create-new-trip/             # Conversational trip builder & map workspace
│   ├── dashboard/                   # Travel analytics, Haversine distance & cost stats
│   ├── my-trips/                    # Saved trip cards & history
│   ├── pricing/                     # Subscription plans & credit upgrades
│   ├── tools/converter/             # Standalone Travel Toolkit (Currency/Timezone/Events)
│   ├── view-trip/[tripId]/          # Interactive trip detail, companion & PDF guide
│   ├── about/, adventure/, contact/, hidden-gems/, inspire/
│   ├── error.tsx & not-found.tsx    # Resilient error boundary & 404 fallback
│   └── layout.tsx & provider.tsx    # Global providers, skip-link & <main> landmark
├── components/ui/                   # Accessible UI primitives, modals & animations
├── convex/                          # Convex schema, user credits & trip mutations
├── lib/
│   ├── ai-helpers.ts                # JSON payload recovery, UI inference & validation
│   ├── arcjet.ts                    # Token bucket rate limiter
│   └── travel-utils.ts              # Shared geo, currency, Haversine & cost utilities
└── types/trip.ts                    # Shared strict TypeScript domain types
```

---

## 🏃‍♂️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/himanshuGupta8858/sky-trip-planner.git
cd sky-trip-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

### 4. Run Quality Checks & Tests
```bash
npm run typecheck   # Strict TypeScript check (tsc --noEmit)
npm run lint        # ESLint verification
npm test            # Run Vitest unit, API & accessibility tests
npm run build       # Production Next.js build verification
```

### 5. Launch Development Servers
```bash
npx convex dev
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).
