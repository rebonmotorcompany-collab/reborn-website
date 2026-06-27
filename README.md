# EV Showroom & Distribution ERP System - Phase 1

A comprehensive, production-ready Enterprise Resource Planning (ERP) system for electric vehicle showrooms and distribution networks.

## 📋 Project Structure

```
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── config/      # Configuration files (db, redis, etc.)
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── types/       # TypeScript interfaces
│   │   ├── utils/       # Helper functions (JWT, password, 2FA)
│   │   └── app.ts       # Express app setup
│   ├── prisma/          # Prisma ORM schema
│   ├── docker-compose.yml # PostgreSQL + Redis
│   └── package.json
│
├── frontend/            # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux state management
│   │   ├── services/    # API calls
│   │   ├── hooks/       # Custom hooks
│   │   ├── types/       # TypeScript interfaces
│   │   ├── App.tsx      # Main App component
│   │   └── main.tsx     # React entry point
│   ├── index.html       # HTML entry point
│   ├── vite.config.ts   # Vite configuration
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker & Docker Compose
- PostgreSQL (or use Docker Compose)
- Redis (or use Docker Compose)

### Step 1: Start Database & Cache

```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env if needed

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data (optional)
npm run prisma:seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Authentication Flow

### Registration
1. User enters company name, email, password, first name, last name
2. System creates tenant (company) automatically
3. Admin role created with default permissions
4. User registered as Admin

### Login
1. User enters email and password
2. If 2FA enabled, prompt for 2FA token
3. System returns access token + refresh token
4. Frontend stores tokens in localStorage

### 2FA Setup
1. User initiates 2FA setup
2. System generates QR code
3. User scans with authenticator app
4. User enters 6-digit token to verify
5. 2FA enabled for account

## 📦 Database Schema (Phase 1)

### Core Tables
- `tenants` - Companies/Organizations
- `users` - System users
- `roles` - User roles (Admin, Manager, Salesman, Accountant, BranchManager)
- `permissions` - Role-based permissions
- `audit_logs` - Activity tracking
- `login_logs` - Login history

### Inventory Tables
- `vehicles` - Vehicle records with status (available, reserved, sold, claimed)
- `vehicle_models` - Vehicle models and specifications
- `vehicle_batteries` - Battery tracking with serial numbers
- `battery_history` - Battery lifecycle history
- `spare_parts` - Spare parts inventory
- `spare_part_inventory` - Stock levels by part
- `spare_part_history` - Stock transaction history

### Customer & Dealer Tables
- `customers` - Customer records with CNIC
- `customer_vehicles` - Vehicle ownership tracking
- `dealers` - Dealer/distributor records
- `dealer_orders` - B2B orders
- `dealer_ledger` - Credit tracking

### Sales & Warranty Tables
- `sales_invoices` - Sales transactions
- `payments` - Payment records
- `delivery_notes` - Delivery tracking
- `warranty_claims` - Warranty claim management
- `claim_documents` - Claim attachments
- `claim_workflow` - Claim status workflow
- `claim_resolutions` - Claim resolutions

### Utilities
- `notifications` - System notifications
- `system_settings` - Configuration settings

## 🔌 API Endpoints (Phase 1)

### Authentication
```
POST   /api/auth/register          - Register new company
POST   /api/auth/login             - Login user
POST   /api/auth/2fa/setup         - Initialize 2FA
POST   /api/auth/2fa/verify-setup  - Verify 2FA setup
POST   /api/auth/2fa/verify-login  - Verify 2FA during login
POST   /api/auth/refresh-token     - Refresh access token
```

## 🛠️ Available Scripts

### Backend
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI)
npm run test             # Run tests
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## 🔒 Security Features (Phase 1)

✅ JWT-based authentication (access + refresh tokens)
✅ Two-Factor Authentication (2FA) with TOTP
✅ Password hashing with bcryptjs
✅ Role-Based Access Control (RBAC)
✅ Audit logging for all entity changes
✅ Login history tracking
✅ CORS protection
✅ Input validation with express-validator
✅ Environment variable protection

## 📊 Architecture Highlights

- **Multi-Tenancy**: Every tenant (company) has isolated data
- **Type Safety**: Full TypeScript across frontend and backend
- **Real-time Ready**: Redis setup for real-time features
- **Scalable**: Docker-ready for Kubernetes deployment
- **DX**: Hot module reloading, auto-migrations, DevTools

## 📱 Frontend Features (Phase 1)

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode ready (Tailwind setup)
- ✅ Redux state management
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ Error handling
- ✅ Loading states

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Ensure PostgreSQL is running
docker-compose ps

# If not running
docker-compose up -d
```

### Port Already in Use
```bash
# Backend running on different port
PORT=5001 npm run dev

# Frontend running on different port
npm run dev -- --port 5174
```

### Prisma Migration Issues
```bash
# Reset database (careful - deletes all data)
npm run prisma:migrate reset
```

## 🚦 Next Steps (Phase 2+)

- Vehicle inventory management API
- Sales invoicing system
- Customer management dashboard
- Dealer management & credit control
- Financial accounting module
- Warranty claims workflow
- Multi-branch warehouse management
- Advanced analytics & reports

## 📄 License

MIT

## 👥 Support

For issues and questions, please check the documentation or create an issue.

---

**Built with ❤️ for the EV Industry**
