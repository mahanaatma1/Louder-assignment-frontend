# Sydney Events Frontend

Frontend application for Sydney Events - A dynamic event listing website.

## Folder Structure

```
frontend/
├── src/
│   ├── actions/                    # Server actions & API calls
│   │   ├── actions.js              # Main action handlers
│   │   ├── base_url.js            # API base URL configuration
│   │   └── default.js             # Default actions
│   │
│   ├── app/                        # Next.js App Router
│   │   ├── (main-landing)/        # Main landing page route group
│   │   │   └── page.js
│   │   ├── events/                 # Events page
│   │   │   └── page.js
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Root page (redirects)
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                 # React components
│   │   ├── events/                 # Event-related components
│   │   │   ├── EventCard/
│   │   │   │   ├── EventCard.jsx
│   │   │   │   └── index.js
│   │   │   ├── EmailModal/
│   │   │   │   ├── EmailModal.jsx
│   │   │   │   └── index.js
│   │   │   └── EventGrid/
│   │   │       ├── EventGrid.jsx
│   │   │       └── index.js
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── reusable/               # Reusable components
│   │   └── shared/                 # Shared utility components
│   │
│   ├── contexts/                   # React contexts
│   │   └── EventsContext.js
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useEvents.js
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── constants.js            # App-wide constants
│   │   └── utils.js                # Utility functions
│   │
│   └── store/                      # State management (Zustand)
│       └── events-store.js
│
├── public/                          # Static assets
├── components.json                  # shadcn/ui configuration
├── package.json                     # Dependencies
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Key Features

- **Event Listing**: Beautiful grid display of events
- **Email Capture**: Modal for email subscription before ticket redirect
- **Auto-refresh**: Manual refresh button to update events
- **Responsive Design**: Mobile-first responsive layout
- **shadcn/ui**: Modern UI components

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **Zustand** - State management (optional)
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Project Structure

### Actions (`src/actions/`)
- `actions.js` - All API calls
- `base_url.js` - Base URL configuration
- `default.js` - Default action handlers

### Components (`src/components/`)
- `events/` - Event-related components
- `ui/` - shadcn/ui primitives
- `reusable/` - Reusable components
- `shared/` - Shared utility components

### App Router (`src/app/`)
- Route groups for organizing pages
- Layouts for shared UI
- Pages for different routes

## Environment Variables

Create a `.env.local` file:

```env
# Backend Server URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Frontend URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** All API calls are made through `actions.js` which connects directly to the backend server (Express) running on port 3001.
