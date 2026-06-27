# EV Showroom & Distribution ERP - Development Guide

## 🎯 Quick Start (5 minutes)

### 1. Start Databases
```bash
docker-compose up -d
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run prisma:migrate
npm run dev
```

Backend: http://localhost:5000

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

### 4. Login
- **Register**: Click "Register here" and create company account
- **Login**: Use credentials from registration

---

## 📚 Project Overview

### What's Included (Phase 1)

✅ **Complete Authentication System**
- User registration with company setup
- Secure JWT-based login
- Two-Factor Authentication (2FA)
- Token refresh mechanism
- Audit logging

✅ **Database Foundation**
- Multi-tenant PostgreSQL schema
- 30+ core tables pre-designed
- Role-Based Access Control (RBAC)
- Audit trail tables

✅ **Backend API**
- Express.js REST API
- TypeScript with strict typing
- Input validation
- Error handling middleware
- Prisma ORM integration

✅ **Frontend Application**
- React 18 with TypeScript
- Redux state management
- Tailwind CSS styling
- Protected routes
- Responsive design

✅ **DevOps Ready**
- Docker Compose setup
- Environment configuration
- Production build setup

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                   │
│  - Login/Register Pages                             │
│  - Dashboard                                        │
│  - Protected Routes                                 │
│  - Redux State Management                           │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────┐
│              API SERVER (Express.js)                │
│  - Authentication Routes                           │
│  - JWT Middleware                                  │
│  - Error Handling                                  │
│  - Audit Logging                                   │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼───┐   ┌───▼────┐  ┌───▼────┐
   │Database│   │ Cache  │  │ File   │
   │(PgSQL) │   │(Redis) │  │Storage │
   └────────┘   └────────┘  └────────┘
```

---

## 🗄️ Database Schema

### Multi-Tenancy
- Every table has `tenantId` for data isolation
- Supports SaaS with multiple companies

### Core Entities

**Authentication**
```
Tenant → Users → Roles → Permissions
         ↓
    AuditLogs, LoginLogs
```

**Inventory**
```
Vehicles → VehicleBatteries → BatteryHistory
           SpareParts → SparePartInventory → SparePartHistory
```

**Commerce**
```
Customers ← SalesInvoices → Payments, DeliveryNotes
Dealers ← DealerOrders → DealerLedger
```

**Support**
```
WarrantyClaims → ClaimDocuments
              → ClaimWorkflow
              → ClaimResolutions
```

---

## 🔌 API Examples

### Register Company
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Tesla Showroom India",
    "email": "admin@tesla-india.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tesla-india.com",
    "password": "SecurePass123"
  }'
```

### Setup 2FA
```bash
curl -X POST http://localhost:5000/api/auth/2fa/setup \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 📁 File Organization

### Backend (`/backend`)
```
src/
├── config/           # DB, Redis, Environment
├── controllers/      # Request handlers
├── middleware/       # Auth, Error, Audit
├── routes/          # API endpoints
├── services/        # Business logic
├── types/           # TypeScript interfaces
├── utils/           # JWT, Password, 2FA
├── app.ts           # Express app
└── index.ts         # Server entry
```

### Frontend (`/frontend`)
```
src/
├── components/      # React components
├── pages/          # Page components
├── store/          # Redux store
├── services/       # API client
├── hooks/          # Custom hooks
├── types/          # TypeScript types
├── App.tsx         # Main component
└── main.tsx        # React entry
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|-----------------|
| **Authentication** | JWT with access + refresh tokens |
| **2FA** | TOTP (Google Authenticator) |
| **Passwords** | bcryptjs with 10 salt rounds |
| **Authorization** | RBAC with permissions matrix |
| **Audit Trail** | All entity changes logged |
| **Input Validation** | express-validator on all endpoints |
| **CORS** | Configured for frontend origin |
| **Rate Limiting** | (Ready for Phase 2) |

---

## 🧪 Testing the System

### Test Registration
1. Go to http://localhost:5173
2. Click "Register here"
3. Fill form with:
   - Company: "My EV Company"
   - Email: "test@test.com"
   - Password: "TestPass123"
   - First Name: "John"
   - Last Name: "Doe"
4. Click "Create Account"

### Test Login
1. Use credentials from registration
2. Should see dashboard

### Test Protected Route
1. Try accessing http://localhost:5173/dashboard without login
2. Should redirect to login page

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

# Development
npm run dev                 # Start dev server
npm run build              # Build TypeScript
npm run test               # Run tests
npm run lint               # Lint code

# Database
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open GUI
npm run prisma:seed        # Seed data
```

### Frontend
```bash
cd frontend

# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm run preview            # Preview build

# Code Quality
npm run lint               # Lint code
npm run format             # Format code
```

### Docker
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to database
**Solution:**
```bash
docker-compose ps  # Check if postgres is running
docker-compose up -d postgres  # Start if not running
```

### Issue: Port 5000/5173 already in use
**Solution:**
```bash
# Backend on different port
PORT=5001 npm run dev

# Frontend on different port
npm run dev -- --port 5174
```

### Issue: Prisma migration fails
**Solution:**
```bash
cd backend
npm run prisma:migrate reset  # WARNING: Deletes data
npm run prisma:migrate        # Create fresh migration
```

### Issue: Frontend can't reach backend
**Solution:**
- Ensure backend is running on http://localhost:5000
- Check vite proxy in `frontend/vite.config.ts`
- Check CORS settings in `backend/src/app.ts`

---

## 📈 Next Steps (Phase 2+)

| Phase | Focus | Timeline |
|-------|-------|----------|
| Phase 1 ✅ | Auth, Dashboard Foundation | Weeks 1-3 |
| Phase 2 | Vehicle Inventory, Battery Mgmt | Weeks 4-9 |
| Phase 3 | Sales, Invoicing, Customers | Weeks 10-13 |
| Phase 4 | Dealers, Finance, Accounts | Weeks 14-20 |
| Phase 5 | Claims, Warranty, Multi-Branch | Weeks 21-26 |
| Phase 6 | Reports, Analytics, Polish | Weeks 27-36 |

---

## 💡 Tips for Development

### Hot Reload
- Backend: Changes auto-reload via `ts-node-dev`
- Frontend: Vite provides instant HMR

### Debugging
- Backend: Use Node debugger or console.log
- Frontend: React DevTools extension
- API: Use Postman or curl for testing

### Database Queries
- Open Prisma Studio: `npm run prisma:studio`
- View real-time data in GUI

### Environment Variables
- Backend: `.env` file
- Frontend: `.env.local` file (Vite)
- Never commit `.env` files

---

## 📞 Support

For detailed documentation:
- Backend: See [backend/README.md](backend/README.md)
- Frontend: See [frontend/README.md](frontend/README.md)
- General: See [README.md](README.md)

---

**Happy Coding! 🚀**
