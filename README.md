# SkyTrip - AI-Powered Trip Planner

<div align="center">
  <img src="./public/logo.svg" alt="SkyTrip Logo" width="100" height="auto" />
  <h2>✈️ SkyTrip - AI-Powered Travel Planner</h2>
  <p><strong>Transforming travel planning with cutting-edge AI, interactive mapping, and real-time assistant chats.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js%2015-000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Clerk%20Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    <img src="https://img.shields.io/badge/Convex-000?style=for-the-badge&logo=convex&logoColor=white" alt="Convex" />
  </p>
</div>

---

## ✨ Overview

**SkyTrip** is a next-generation AI travel planner designed to replace hours of research, chaotic browser tabs, and fragmented planning notes with a single, unified travel hub. 

Provide your destination, budget, duration, and travel crew, and SkyTrip will dynamically construct a complete day-by-day itinerary complete with live hotel listings, location markers, ticket estimates, and an interactive route-drawn map.

---

## 🛠️ Technology Stack & Architecture

SkyTrip is architected using a modern, robust, and highly performant full-stack ecosystem:

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, API Routes)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict compilation configurations for type safety)
*   **AI Engine:** [Google Gemini API / OpenRouter](https://ai.google.dev/) (Leverages structured schema validation for consistent JSON itinerary structure)
*   **Real-time Database & BaaS:** [Convex](https://www.convex.dev/) (Zero-latency reactive data synchronization and edge database operations)
*   **Authentication & Security:** [Clerk Auth](https://clerk.com/) (Secure sign-ins, sign-ups, and user sessions)
*   **Map Integrations:** [Google Maps Platform](https://developers.google.com/maps) (`@react-google-maps/api` for custom markers, path polylines, and dynamic coordinate fitting; Google Places API for context-based hotel and activity image lookup)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Responsive, modern design system featuring custom utility classes)
*   **Animations:** [Framer Motion / Motion](https://motion.dev/) (Fluid layout transitions, timelines, and dynamic page effects)
*   **API Protection:** [Arcjet](https://arcjet.com/) (Protects API routes with token bucket rate limiting and bot detection)

---

## 🚀 Key Features & Implementation

### 1. 🧠 Structured AI Itinerary Generation
*   Takes user inputs and sends custom prompts to Gemini to construct structured, type-safe JSON itinerary documents containing activities, hotels, details, and exact geographical coordinates.
*   Integrates fallback systems to ensure elegant handling of API errors or format variations.

### 2. 🗺️ Interactive Maps & Dynamic Day Filtering
*   Incorporates a detailed, custom-themed **Google Map** (`GlobalMap`) directly beside the itinerary.
*   **Dynamic Route Drawing:** Select a specific day on the trip timeline to instantly highlight that day's activities. The map dynamically updates its bounds to focus on that region and draws a polyline route (Hotel ➔ Activity 1 ➔ Activity 2 ➔ Hotel).
*   Includes a functional **Overview** resetting action button that instantly centers the map view to display all days and hotels.

### 3. 💬 Real-Time AI Travel Chatbot Assistant
*   Features a persistent floating chatbot (`TripChatbot`) on the trip detail screen.
*   Pre-loaded with the generated trip context so it can immediately answer specific queries (e.g., packing tips, estimated ticket pricing, hotel reviews, food recommendations, and local travel tips).
*   Supports standard typing interactions as well as quick-click suggested questions.

### 4. 🏨 Booking & Places Engine
*   Integrates direct booking redirects to popular booking platforms, appending location-specific parameters.
*   Fetches high-quality location photos on the fly from the Google Places API with robust placeholder fallbacks for when images are unavailable.

### 5. 🎒 Checklist Tracker
*   Auto-populates a packing list (`PackingList`) suited for the duration and theme of the trip, allowing users to check off items as they pack.

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/                    # API route for handling AI chatbot assistant requests
│   ├── view-trip/
│   │   └── [tripId]/                # Main page displaying the generated trip details
│   ├── create-new-trip/
│   │   ├── page.tsx                 # Form to customize and trigger AI trip creation
│   │   └── _component/
│   │       ├── GlobalMap.tsx        # Google Maps wrapper (markers, bounds, and polylines)
│   │       ├── Itinerary.tsx        # Timeline-based day-by-day planner component
│   │       ├── PackingList.tsx      # Checklist generator component
│   │       └── TripChatbot.tsx      # Floating contextual AI chatbot
│   ├── layout.tsx                   # Main global layout and Tailwind imports
│   └── provider.tsx                 # Global state providers (Clerk, Convex, state hooks)
├── components/
│   └── ui/                          # Custom UI design tokens, buttons, and animations
├── convex/
│   ├── schema.ts                    # Convex relational database tables and schemas
│   └── tripDetail.ts                # Convex query definitions for fetching trips by ID
└── package.json                     # Root manifest and run configurations
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

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Clerk Credentials
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Convex Database Credentials
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# API Access Keys
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_maps_and_places_key
OPENAI_API_KEY=your_gemini_or_openrouter_api_key
```

### 4. Sync Database Schema & Mutations
In a separate terminal tab, run the Convex development engine:
```bash
npx convex dev
```

### 5. Launch the Client Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and design your first adventure!

---

## 💡 Engineering Highlights
*   **Fully Responsive Splits:** Features an adaptive layout that renders side-by-side (60/40) on wider viewports and gracefully stacks vertically on smaller mobile viewports.
*   **Strict Typing:** Designed with compile-time type verification, minimizing production runtime errors.
*   **Contextual Caching:** Persists itineraries inside Convex, ensuring instant loading states for returning users without triggering repeated AI API queries.
