# Discipline Forge - Premium Gamified Habit Tracker

## Overview

Discipline Forge is a premium mobile-first habit tracking web application designed to help users build discipline through gamification, streaks, and achievement systems. The app combines the addictive mechanics of Duolingo with the motivational feel of Nike Training Club, creating an engaging experience that encourages daily task completion.

The application allows users to create custom tasks with flexible frequency settings (daily, weekly, or custom days), track their progress with visual heatmaps, earn discipline points and XP, unlock achievements, and purchase trophies and badges in an in-app shop. The entire experience is designed to feel like a premium $10 mobile game with satisfying visual feedback, celebrations, and share-worthy moments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for fast development and optimized production builds.

**Routing**: Wouter for lightweight client-side routing with 4 main pages (Dashboard, Shop, Stats, Profile).

**State Management**: Local-first architecture using browser localStorage as the primary data store, with React hooks for component-level state. No server synchronization in the current implementation - all data persists client-side only.

**UI Framework**: shadcn/ui component library built on Radix UI primitives, providing accessible, customizable components styled with Tailwind CSS using the "new-york" style variant.

**Design System**: 
- Primary font: Poppins (Google Fonts) for bold, gamified feel
- Secondary font: Inter for data/stats
- Mobile-first responsive design with max-width containers (max-w-md)
- Custom color system using CSS variables for theming
- Generous spacing using Tailwind's spacing primitives (2, 4, 6, 8, 12, 16)

**Key UI Patterns**:
- Bottom navigation bar (fixed, mobile-native feel) with 4 tabs
- Card-based layouts for content sections
- Progress rings and heatmaps for visual feedback
- Modal dialogs for task creation
- Confetti celebrations using canvas-confetti library
- Sound effects for user actions (toggleable)

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in both development and production modes.

**Development Setup**: Vite development server in middleware mode with HMR (Hot Module Replacement) for instant feedback during development.

**Production Setup**: Static file serving from pre-built `dist/public` directory with SPA fallback to index.html.

**API Design**: RESTful API endpoints at `/api/*` for tasks, user stats, achievements, and shop items. However, the frontend currently bypasses these APIs and uses localStorage directly.

**Storage Interface**: Abstract `IStorage` interface defining CRUD operations, with `MemStorage` implementation providing in-memory storage. The system is designed to support future database integration (Drizzle ORM configuration exists for PostgreSQL via Neon).

**Session Management**: Infrastructure exists for connect-pg-simple sessions, though authentication is not currently implemented.

### Data Models

**Task Schema**:
- Flexible frequency system (daily, weekly, custom days)
- Optional time reminders and motivational notes
- Streak tracking (current and best)
- Completed dates array for historical tracking

**User Stats Schema**:
- Gamification metrics: level, XP, discipline points
- Achievement tracking: total tasks completed, streaks
- User preferences: premium status, sound settings, onboarding completion

**Achievement Schema**:
- Unlockable achievements with icons and descriptions
- Requirement-based unlocking system
- Locked/unlocked state tracking

**Shop Item Schema**:
- Two categories: trophies and badges
- Cost in discipline points
- Ownership and purchase date tracking

### Progressive Web App (PWA)

**Service Worker**: Custom service worker (`sw.js`) implementing cache-first strategy for offline support with navigation fallback to index.html.

**Manifest**: Web app manifest configured for standalone display mode with portrait orientation, custom theme colors, and app icons.

**Installation**: Supports "Add to Home Screen" functionality on mobile devices for native app-like experience.

### Build and Deployment

**Development**: `npm run dev` runs Vite dev server with Express backend, automatic reloading, and Replit-specific plugins (cartographer, dev banner, runtime error overlay).

**Production Build**: Two-step process:
1. Vite builds client to `dist/public`
2. esbuild bundles server code to `dist/index.js` as ESM module

**Type Safety**: Shared schema definitions between client and server using Zod for runtime validation and TypeScript for compile-time checking.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component library following the "new-york" style
- **Lucide React**: Icon library for consistent iconography
- **canvas-confetti**: Celebration animations library

### Data and State
- **Zod**: Schema validation for type-safe data models
- **TanStack Query**: Server state management (infrastructure exists but not actively used due to localStorage approach)
- **nanoid**: Unique ID generation for entities

### Backend Infrastructure
- **Drizzle ORM**: Database toolkit configured for PostgreSQL (infrastructure ready but not connected)
- **@neondatabase/serverless**: PostgreSQL database driver for Neon cloud database
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not active)

### Development Tools
- **Vite**: Build tool and development server
- **esbuild**: JavaScript bundler for production server code
- **tsx**: TypeScript execution for development server
- **Replit plugins**: Development banner, cartographer for code navigation, runtime error modal

### Fonts
- **Google Fonts**: Poppins (primary) and Inter (secondary) loaded via CDN

### Future Monetization (Planned)
- AdMob integration for rewarded ads (task revival feature)
- Premium upgrade system ($3.99 one-time payment) for ad removal and additional features