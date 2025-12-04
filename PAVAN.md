# PAVAN.md - Developer Notes & Architecture Guide

## Project Overview

Blue Kailash International is a freight logistics management application designed to streamline import-export operations. This document provides in-depth technical details for developers.

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Nginx Reverse Proxy                         │
│            (Static files + API proxy)                           │
└─────────────────────────────────────────────────────────────────┘
                    │                    │
                    ▼                    ▼
┌─────────────────────────┐  ┌─────────────────────────────────┐
│     Frontend (React)     │  │     Backend (Express)            │
│     - SPA Application    │  │     - REST API                   │
│     - Served by Nginx    │  │     - Session Auth               │
└─────────────────────────┘  │     - Business Logic             │
                              └─────────────────────────────────┘
                                            │
                                            ▼
                              ┌─────────────────────────────────┐
                              │      PostgreSQL Database         │
                              │      - Drizzle ORM               │
                              └─────────────────────────────────┘
```

### Data Flow

1. **Quote Request Flow**
   ```
   Client → Submit Quote Form → API Validation → Create Quote (pending)
   Admin → Review Quote → Set Price → Update Status (quoted/accepted/rejected)
   Admin → Convert to Shipment → Create Shipment + Initial Event
   ```

2. **Shipment Tracking Flow**
   ```
   Admin → Create/Update Shipment → Add Tracking Events
   Client → Enter Tracking Number → Fetch Shipment + Events
   ```

3. **Authentication Flow**
   ```
   User → Login via Replit OAuth → Session Created
   API Request → Session Validated → User Claims Extracted
   Admin Request → isAdmin Middleware → Role Check → Access Granted/Denied
   ```

## Database Schema

### Entity Relationship

```
users ────────────────────────────────────────────────────────┐
  │                                                           │
  ├──< quotes (userId) ──────────────────────────────┐        │
  │                                                   │        │
  ├──< shipments (userId) ──< shipment_events        │        │
  │         │                                         │        │
  │         └──< documents (shipmentId)              │        │
  │         │                                         │        │
  │         └──< invoices (shipmentId)               │        │
  │                                                   │        │
  └──< invoices (userId)                             │        │
                                                      │        │
products (standalone)                                 │        │
                                                      │        │
contact_messages (standalone)                         │        │
                                                      │        │
admin_settings (key-value store)                     │        │
```

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| users | User accounts | id, email, role (admin/client) |
| products | Product catalog | name, hsCode, category |
| quotes | Quote requests | origin, destination, status |
| shipments | Active shipments | trackingNumber, status |
| shipment_events | Tracking history | status, description, timestamp |
| invoices | Payment records | amount, status (paid/unpaid) |
| documents | Shipment docs | type, fileName, fileUrl |
| contact_messages | Contact form | name, email, message |
| admin_settings | App config | key, value, description |

### Shipment Status Flow

```
processing → customs_clearance → in_transit → arrived → delivered
                  │
                  └──→ on_hold (can happen at any stage)
```

### Quote Status Flow

```
pending → quoted → accepted ──→ (converted to shipment)
            │
            └──→ rejected
```

## API Design

### Response Format

All API responses follow a consistent format:

**Success:**
```json
{
  "id": 1,
  "field": "value",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Error:**
```json
{
  "message": "Error description",
  "errors": [/* validation errors */]
}
```

### Authentication

- Session-based auth using express-session
- PostgreSQL session store (connect-pg-simple)
- Falls back to in-memory store when DB unavailable
- Admin endpoints require `isAdmin` middleware

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: "Validation error", errors: error.errors });
  }
  console.error("Operation failed:", error);
  res.status(500).json({ message: "Operation failed" });
}
```

## Frontend Architecture

### Component Structure

```
client/src/
├── pages/           # Route-level components
│   ├── Home.tsx     # Landing page
│   ├── Products.tsx # Product catalog
│   ├── Track.tsx    # Shipment tracking
│   └── Admin/       # Admin pages
├── components/
│   ├── ui/          # Shadcn components
│   └── ...          # Feature components
├── hooks/           # Custom hooks
├── lib/             # Utilities
└── App.tsx          # Root + routing
```

### State Management

- **Server State**: TanStack Query for all API data
- **Form State**: React Hook Form with Zod
- **Local State**: React useState for UI state

### Data Fetching Pattern

```typescript
// Query
const { data, isLoading } = useQuery<Product[]>({
  queryKey: ['/api/products'],
});

// Mutation
const mutation = useMutation({
  mutationFn: (data) => apiRequest('/api/products', 'POST', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    toast({ title: "Success!" });
  },
});
```

## Storage Layer

### Dual Storage System

The application supports both PostgreSQL and in-memory storage:

```typescript
function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    return new DatabaseStorage();
  }
  return new MemStorage();
}
```

This allows:
- Development without database
- Graceful degradation
- Easy testing

### Storage Interface

All storage operations go through `IStorage` interface:
- Consistent API for both implementations
- Easy to add caching layer
- Simple mocking for tests

## Docker Configuration

### Services

1. **database**: PostgreSQL 16 Alpine
2. **backend**: Node.js API server
3. **frontend**: Nginx serving static files

### Networking

All services connected via `bluekailash-network`:
- Frontend proxies `/api/*` to backend
- Backend connects to database internally
- Only frontend:80 exposed externally

### Health Checks

Each service has health checks:
- Database: `pg_isready`
- Backend: `GET /health`
- Frontend: nginx health

## Security Considerations

### Authentication
- Session-based with secure cookies
- httpOnly cookies to prevent XSS
- Secure flag for HTTPS only

### Authorization
- Role-based access (admin/client)
- Middleware-protected admin routes
- User scoped data access

### Input Validation
- Zod schemas for all inputs
- SQL injection prevented by ORM
- XSS prevented by React

### Headers (Nginx)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

## Performance Optimizations

### Frontend
- Code splitting by route
- Image optimization
- Gzip compression via Nginx
- Static asset caching (30 days)

### Backend
- Connection pooling (Neon)
- Query optimization with indexes
- Response compression

### Caching Strategy
- TanStack Query caches responses
- Cache invalidation on mutations
- Stale-while-revalidate pattern

## Monitoring & Logging

### Log Format
```
[timestamp] [component] METHOD path status latency :: body
```

### Health Endpoints
- `GET /health` - Public, basic status
- `GET /api/admin/health` - Admin, detailed metrics

### Recommended Monitoring
- Uptime monitoring on /health
- Error rate tracking
- Response time alerting

## Development Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Explicit return types for functions
- Meaningful variable/function names

### Git Workflow
1. Feature branches from `develop`
2. PR review required
3. CI must pass
4. Squash merge to develop
5. Release branches to `main`

### Testing Strategy
- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows

## Troubleshooting

### Common Issues

**Database Connection**
```
Check DATABASE_URL format:
postgresql://user:pass@host:port/db
```

**Session Issues**
```
Ensure SESSION_SECRET is set
Check cookie settings for local dev
```

**Build Failures**
```
Clear node_modules and reinstall
Check TypeScript errors
Verify all imports
```

## Future Improvements

- [ ] WebSocket for real-time tracking
- [ ] Email notifications
- [ ] PDF invoice generation
- [ ] Multi-language support
- [ ] Audit logging
- [ ] Rate limiting
- [ ] API key authentication for integrations

---

*Last updated: December 2024*
