# Blue Kailash International

A comprehensive import-export and freight logistics web application for managing products, quotes, shipments, invoices, and client communications.

## Overview

Blue Kailash International is a full-stack logistics management platform built with modern web technologies. It provides a complete solution for freight forwarding businesses with role-based access control (admin/client), real-time shipment tracking, quote management, and document handling.

## Features

### Public Features
- **Product Catalog**: Browse available export products with detailed information
- **Quote Request**: Submit freight quote requests for new shipments
- **Shipment Tracking**: Real-time tracking with tracking number lookup
- **Contact Form**: Direct communication with the logistics team

### Client Portal
- View personal quotes and their status
- Track assigned shipments
- Access invoices and payment status
- Download shipment documents

### Admin Dashboard
- **User Management**: View and manage client accounts
- **Quote Management**: Review, price, and approve/reject quote requests
- **Shipment Operations**: Create, update, and track all shipments
- **Invoice Generation**: Create and manage invoices
- **Document Management**: Upload and organize shipment documents
- **Settings**: Configure application-wide settings
- **Analytics**: View business metrics and reports

## Technology Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Shadcn/UI component library
- TanStack Query for data fetching
- Wouter for routing
- React Hook Form with Zod validation

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM with PostgreSQL
- Session-based authentication
- RESTful API design

### Infrastructure
- Docker & Docker Compose
- Nginx reverse proxy
- PostgreSQL database
- GitHub Actions CI/CD

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (local or cloud instance)

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/bluekailash.git
cd bluekailash

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Docker Deployment

```bash
# Navigate to docker directory
cd docker

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
bluekailash/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and helpers
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── db.ts               # Database connection
│   ├── storage.ts          # Data access layer
│   ├── routes.ts           # API endpoints
│   └── index.ts            # Server entry point
├── shared/                 # Shared code (types, schemas)
│   └── schema.ts           # Drizzle ORM schemas
├── docker/                 # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml
│   └── nginx/
├── scripts/                # Utility scripts
│   ├── setup.sh
│   ├── seed.sh
│   └── docker-push.sh
└── .github/workflows/      # CI/CD pipelines
```

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/quotes` | Submit quote request |
| GET | `/api/shipments/track/:number` | Track shipment |
| POST | `/api/contact` | Submit contact message |
| GET | `/health` | Health check |

### Authenticated Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/user` | Get current user |
| GET | `/api/quotes/my` | Get user's quotes |
| GET | `/api/shipments/my` | Get user's shipments |
| GET | `/api/invoices/my` | Get user's invoices |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/quotes` | List all quotes |
| PATCH | `/api/admin/quotes/:id` | Update quote |
| POST | `/api/admin/quotes/:id/convert` | Convert quote to shipment |
| GET | `/api/admin/shipments` | List all shipments |
| POST | `/api/admin/shipments` | Create shipment |
| PATCH | `/api/admin/shipments/:id` | Update shipment |
| DELETE | `/api/admin/shipments/:id` | Delete shipment |
| GET | `/api/admin/invoices` | List all invoices |
| POST | `/api/admin/invoices` | Create invoice |
| GET | `/api/admin/messages` | List contact messages |
| GET | `/api/admin/settings` | Get app settings |
| PUT | `/api/admin/settings/:key` | Update setting |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `REPL_ID` | Replit application ID | Yes |
| `ISSUER_URL` | OIDC issuer URL | No |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 5000) | No |

## Development Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio
npm test            # Run tests
npm run lint        # Run linter
```

## Deployment

### Replit Deployment
This application is optimized for Replit deployment:
1. Import the repository to Replit
2. Configure environment secrets
3. Click "Run" to start the application
4. Use "Deploy" to publish publicly

### Docker/VPS Deployment
1. Build Docker images using the provided Dockerfiles
2. Push to your container registry
3. Deploy using docker-compose or Kubernetes
4. Configure reverse proxy (nginx included)

### CI/CD
GitHub Actions workflow handles:
- Code linting and testing
- Docker image building
- Automatic deployment to staging/production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact:
- Email: support@bluekailash.com
- Phone: +977-1-XXXXXXX

---

**Blue Kailash International** - Your trusted partner in global logistics.
