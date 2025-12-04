# Blue Kailash International - Import & Export Platform

## Overview

Blue Kailash International is a full-stack web application for an import-export company specializing in agriculture, spices, textiles, and handicrafts. The platform enables clients to browse products, request quotes, track shipments, and access invoices/documents, while providing administrators with comprehensive management capabilities.

The application serves as a B2B portal connecting Indian producers with global markets across 10+ countries, offering end-to-end export/import services including freight forwarding, customs clearance, and supply chain management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**Routing**: Wouter for client-side routing with the following page structure:
- Public pages: Landing, About, Services, Products, Product Detail, Quote Request, Tracking, Contact, Privacy, Terms
- Protected pages: Dashboard (client portal), Admin (admin panel)

**UI Components**: shadcn/ui component library (New York style) with Radix UI primitives for accessible, customizable components

**Styling**: Tailwind CSS with custom design system implementing:
- Brand colors: Deep Indigo (#0B3D91), Teal (#1BA39C), Warm Gold (#D9A441)
- Typography: Poppins for headings, Inter for body text
- Custom CSS variables for theming with light/dark mode support
- Design inspiration from professional B2B platforms (Maersk, DHL, Stripe, Linear)

**State Management**: TanStack Query (React Query) for server state management with optimistic updates and caching

**Forms**: React Hook Form with Zod validation for type-safe form handling

**Authentication**: Replit Auth (OpenID Connect) integrated via Passport.js with session management

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API structure with route organization:
- Public routes: Product listings, quote submissions, contact messages, shipment tracking
- Protected routes: User-specific quotes, shipments, invoices (requires authentication)
- Admin routes: Full CRUD operations for products, quotes, shipments, invoices, documents (requires admin role)

**Authentication & Authorization**: 
- Replit Auth with OpenID Connect for user authentication
- Session-based authentication using express-session with PostgreSQL session store (connect-pg-simple)
- Role-based access control (admin vs. client roles)
- Middleware: `isAuthenticated` and `isAdmin` for route protection

**Session Management**: Server-side sessions stored in PostgreSQL with 7-day TTL, HTTP-only secure cookies

### Data Layer

**Database**: PostgreSQL (via Neon serverless with WebSocket support)

**ORM**: Drizzle ORM for type-safe database queries and migrations

**Schema Design**:
- `users`: User profiles with role-based permissions (admin/client), company info, contact details
- `products`: Product catalog with HS codes, categories, descriptions, specifications, pricing
- `quotes`: Quote requests with status tracking (pending, reviewed, quoted, accepted, rejected)
- `shipments`: Shipment records with tracking numbers, status updates, carrier info
- `shipmentEvents`: Event log for shipment tracking timeline
- `invoices`: Invoice records with payment status and amounts
- `documents`: File metadata for uploaded documents (linked to quotes/shipments)
- `contactMessages`: Contact form submissions
- `sessions`: Session storage for authentication

**Relationships**: Established via Drizzle relations between users and their quotes/shipments/invoices/documents

### File Organization

```
/client          - Frontend application
  /src
    /components  - Reusable UI components (Header, Footer, Layout)
    /pages       - Route-specific page components
    /hooks       - Custom React hooks (useAuth, useToast, useMobile)
    /lib         - Utility functions and query client configuration
/server          - Backend application
  index.ts       - Express server setup and middleware
  routes.ts      - API route definitions
  storage.ts     - Data access layer abstractions
  db.ts          - Database connection and Drizzle instance
  replitAuth.ts  - Authentication setup and middleware
/shared          - Shared TypeScript code
  schema.ts      - Database schema and Zod validation schemas
/script          - Build scripts (esbuild for server, Vite for client)
/scripts         - Utility scripts (setup, seed, docker-push)
/docker          - Docker configuration files
  Dockerfile.frontend  - Frontend build and nginx
  Dockerfile.backend   - Backend build
  docker-compose.yml   - Production orchestration
  docker-compose.dev.yml - Development with pgAdmin
  /nginx           - Nginx configuration
  /database        - Database init scripts
/docs            - Project documentation
  README_FRONTEND.md - Frontend development guide
  README_BACKEND.md  - Backend development guide
/.github/workflows - CI/CD pipeline configuration
```

### Build & Deployment

**Development**: 
- Vite dev server with HMR for frontend
- tsx for TypeScript execution in development
- Concurrent server and client development via Vite middleware mode

**Production Build**:
- Client: Vite builds to `dist/public` as static assets
- Server: esbuild bundles server code to single CJS file with selective dependencies bundled (reduces cold start times)
- Static file serving via Express for SPA with fallback to index.html

**Environment Variables**: 
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit workspace identifier for auth
- `ISSUER_URL`: OpenID Connect issuer URL

## External Dependencies

### Third-Party Services

**Authentication**: Replit Auth (OpenID Connect provider) for user authentication and session management

**Database**: Neon PostgreSQL serverless database with WebSocket connection support

### Key NPM Packages

**Frontend**:
- `@tanstack/react-query`: Server state management and caching
- `react-hook-form` + `@hookform/resolvers`: Form handling with validation
- `zod`: Runtime type validation and schema definition
- `wouter`: Lightweight client-side routing
- `date-fns`: Date formatting and manipulation
- Radix UI components: Accessible headless UI primitives for dialogs, dropdowns, etc.
- `tailwindcss`: Utility-first CSS framework
- `lucide-react`: Icon library

**Backend**:
- `express`: Web server framework
- `drizzle-orm`: Type-safe ORM for PostgreSQL
- `@neondatabase/serverless`: Neon PostgreSQL driver with WebSocket support
- `passport` + `openid-client`: Authentication middleware
- `express-session` + `connect-pg-simple`: Session management with PostgreSQL storage
- `zod`: Input validation on server side
- `ws`: WebSocket library for Neon database connections

**Development**:
- `vite`: Frontend build tool and dev server
- `esbuild`: Server code bundling
- `tsx`: TypeScript execution for development
- `drizzle-kit`: Database migration tool

### UI Component Library

shadcn/ui components configured with "new-york" style variant, using Tailwind CSS for styling and Radix UI primitives for accessibility and functionality.