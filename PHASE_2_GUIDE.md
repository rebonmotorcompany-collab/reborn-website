# EV Showroom & Distribution ERP - Phase 2 Implementation Guide

## 📋 Overview

Phase 2 adds complete **Vehicle Inventory Management** and **Real-time Dashboard KPIs** to the EV Showroom ERP.

### ✅ Completed in Phase 2

#### Backend Services
- `vehicle.service.ts` - Vehicle CRUD with pagination, filtering, searching
- `vehicle-model.service.ts` - Vehicle model management
- `dashboard.service.ts` - Real-time KPI calculations (vehicles, sales, customers, warranty)

#### Backend Routes & Controllers
- `/api/vehicles` - Full REST API with 7 endpoints
- `/api/vehicles/models` - Model management (4 endpoints)
- `/api/dashboard/data` - Single KPI endpoint

#### Frontend Features
- **Dashboard Page** - Real-time KPIs with auto-refresh (60s polling)
  - Vehicle inventory breakdown
  - Monthly sales trends
  - Customer metrics
  - Warranty claim tracking
  - Active alerts and recent activities
  
- **Vehicles Page** - Complete inventory management
  - Create/Edit/Delete vehicles
  - Search by chassis/motor number
  - Filter by status
  - Pagination support
  - Status change dropdown

#### Database
- Seed script to populate demo data (models, vehicles, customers, invoices)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 15
- Redis 6.x
- Docker & Docker Compose (optional)

### Step 1: Start Infrastructure (Backend)

```bash
cd backend
docker-compose up -d
```

Or manually:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### Step 2: Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run prisma:seed

# Start development server
npm run dev
```

Expected output:
```
✓ Backend running on http://localhost:5000
✓ Database connected
```

### Step 3: Setup Frontend

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local - ensure VITE_API_URL=http://localhost:5000

# Start dev server
npm run dev
```

Expected output:
```
✓ Frontend running on http://localhost:5173
✓ API proxy configured
```

---

## 🧪 Testing the Flow

### 1. Login to Application
- URL: `http://localhost:5173`
- Email: `admin@demo.com` (from seed data - if user seed added)
- Password: `Test@123`

### 2. Visit Dashboard
- See live KPI metrics:
  - Total Vehicles: 20
  - Available: Should show count from seed
  - Sales this month: Dynamic from invoices
  - Pending claims: Count from seeded data

### 3. Go to Vehicles
- Should see 20 pre-seeded vehicles
- Try:
  - **Create**: Add new vehicle
  - **Edit**: Click edit button to modify price/status
  - **Search**: Type chassis/motor number
  - **Filter**: Click status dropdown
  - **Delete**: Remove a vehicle
  - **Status Change**: Dropdown updates status immediately

### 4. Verify Real-time Sync
- Create/Update vehicle in UI
- Dashboard KPIs should update (or refresh at 60s interval)
- Check backend logs for request/response

---

## 📊 Key API Endpoints

### Vehicles
```
GET     /api/vehicles                    - List with pagination
POST    /api/vehicles                    - Create vehicle
GET     /api/vehicles/:id                - Get one
PUT     /api/vehicles/:id                - Update (status/price)
DELETE  /api/vehicles/:id                - Delete
GET     /api/vehicles/search?q=VALUE    - Search
GET     /api/vehicles/status/:status    - Filter by status
```

### Models
```
GET     /api/vehicles/models             - List models
POST    /api/vehicles/models             - Create model
PUT     /api/vehicles/models/:id         - Update model
DELETE  /api/vehicles/models/:id         - Delete model
```

### Dashboard
```
GET     /api/dashboard/data              - All KPIs + alerts + activities
```

---

## 🗄️ Database Schema (Phase 2 Tables Active)

**Vehicle Management:**
- `Vehicle` - Core vehicle records (20 from seed)
- `VehicleModel` - Model catalog (4 models: Tesla M3/Y, MG ZS, Hyundai Kona)
- `VehicleBattery` - Battery tracking (for Phase 3)

**Sales & Customers:**
- `SalesInvoice` - Completed sales
- `Customer` - Customer profiles
- `Payment` - Payment history

**Warranty:**
- `WarrantyClaim` - Warranty claims
- `WarrantyClaimStatus` - Status tracking

---

## 🔧 Troubleshooting

### "Cannot find module 'src/config/prisma'"
- Ensure `backend/src/config/prisma.ts` exists
- Run `npm run prisma:generate` to regenerate Prisma Client

### "Database connection refused"
- Check PostgreSQL is running: `docker ps`
- Verify .env DATABASE_URL is correct
- Run migrations: `npm run prisma:migrate`

### "API returns 401 Unauthorized"
- Login first at /login
- JWT token not stored in localStorage - check browser DevTools
- Refresh page and try again

### "Dashboard shows 0 values"
- Ensure seed script ran: `npm run prisma:seed`
- Check Prisma Studio: `npm run prisma:studio` to verify data

### "Vehicles list empty"
- Run seed: `npm run prisma:seed`
- Check tenant ID matches in requests (multi-tenant isolation)

---

## 📝 Next Steps (Phase 3)

1. **Battery Management** - Track vehicle batteries
2. **Spare Parts Inventory** - Stock management
3. **Payment Processing** - Multiple payment methods
4. **WebSocket Real-time** - Replace 60s polling with live updates
5. **Reports & Analytics** - PDF exports, charts
6. **Mobile App** - React Native companion app

---

## 🎯 File Structure Reference

```
backend/
├── src/
│   ├── services/          # Business logic
│   │   ├── vehicle.service.ts      ✅ COMPLETE
│   │   ├── vehicle-model.service.ts ✅ COMPLETE
│   │   └── dashboard.service.ts    ✅ COMPLETE
│   ├── controllers/       # HTTP handlers
│   │   ├── vehicle.controller.ts   ✅ COMPLETE
│   │   └── dashboard.controller.ts ✅ COMPLETE
│   ├── routes/           # API endpoints
│   │   ├── vehicle.routes.ts       ✅ COMPLETE
│   │   └── dashboard.routes.ts     ✅ COMPLETE
│   └── app.ts            # Express setup (updated)
└── prisma/
    ├── schema.prisma     # Database schema (30+ tables pre-designed)
    └── seed.ts          ✅ COMPLETE - Demo data

frontend/
├── src/
│   ├── services/         # API clients
│   │   ├── vehicle.service.ts      ✅ COMPLETE
│   │   └── dashboard.service.ts    ✅ COMPLETE
│   ├── hooks/           # React state management
│   │   ├── useVehicles.ts         ✅ COMPLETE
│   │   └── useDashboard.ts        ✅ COMPLETE
│   ├── components/      # Reusable UI
│   │   ├── VehicleForm.tsx        ✅ COMPLETE
│   │   └── VehicleList.tsx        ✅ COMPLETE
│   ├── pages/          # Full pages
│   │   ├── Dashboard.tsx          ✅ COMPLETE (with real KPIs)
│   │   ├── Vehicles.tsx           ✅ COMPLETE
│   │   └── Inventory.tsx          ✅ COMPLETE (placeholder)
│   └── App.tsx         # Router setup (updated with routes)
```

---

## 🔐 Authentication Context

Current users available (if using default seed):
- Admin user will need to be seeded (not yet included in seed.ts)
- Create account at `/register` to test
- Role: Admin, Permissions: All

---

## 💡 Tips

- Use **Prisma Studio** to inspect/manage data: `npm run prisma:studio`
- Check backend logs with `console.log()` - ts-node-dev shows output
- Redux DevTools helps debug state: Install Redux DevTools extension
- Network tab in DevTools shows API requests/responses
- Check `.env` variables are loaded: Backend logs them on startup

---

## 📞 Support

For issues:
1. Check the troubleshooting section
2. Review backend console logs
3. Check Prisma Studio for data integrity
4. Review browser DevTools Network tab
5. Verify all services running: `docker ps`

---

**Version:** Phase 2 - Vehicle Inventory & Dashboard
**Last Updated:** 2024
**Status:** ✅ Ready for Testing
