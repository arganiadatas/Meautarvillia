# FinBoard.ar - Financial Intelligence Dashboard

## Overview

FinBoard.ar is a real-time financial intelligence dashboard focused on Argentine economic data. It displays exchange rates (including parallel "Blue" dollar rates), economic indicators, market quotes, financial charts, and news. The application provides a professional dark-mode interface for monitoring financial data with live market tickers and interactive TradingView-style charts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Charts**: lightweight-charts (TradingView-style financial charts)
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Reusable UI components in `client/src/components/ui/`
- Custom business components like `FinancialChart`, `MetricCard`, `MarketTicker`, and `Navbar`
- Custom hooks in `client/src/hooks/` for data fetching and mobile detection
- Type-safe API consumption using shared route definitions

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: REST API with typed route definitions in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation

The server provides endpoints for:
- Exchange rates (GET list, PUT update)
- Economic indicators (GET list)
- Chart data (GET time series)
- Market quotes (GET list)
- News items (GET list)

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit manages migrations in `./migrations`

Database tables:
- `exchange_rates` - Dollar quotes (Blue, Official, etc.) with buy/sell prices and trends
- `economic_indicators` - Key economic metrics (TNA, GDP, reserves) with categories
- `chart_data_points` - Time series data for various financial charts
- `market_quotes` - Stock/index prices with change percentages
- `news` - Financial news items with sources and timestamps

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Drizzle table definitions and Zod insert schemas
- `routes.ts` - API route definitions with paths, methods, and response types

### Build System
- Development: Vite dev server with HMR proxied through Express
- Production: Custom build script using esbuild for server bundling and Vite for client
- The build bundles common server dependencies to reduce cold start times

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL (available but not currently used)

### UI Libraries
- **Radix UI**: Headless accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **lightweight-charts**: TradingView-style financial charting library
- **lucide-react**: Icon library
- **date-fns**: Date formatting utilities
- **class-variance-authority**: Component variant management for shadcn/ui

### Development Tools
- **Vite**: Frontend build tool and dev server
- **Drizzle Kit**: Database migration and schema management
- **esbuild**: Server-side bundling for production builds

### Replit-Specific Plugins (Development Only)
- `@replit/vite-plugin-runtime-error-modal`: Error overlay during development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development environment indicator