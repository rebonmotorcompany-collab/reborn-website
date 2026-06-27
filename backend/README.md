# Backend Setup & API Documentation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ev_erp_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
PORT=5000
```

### 3. Setup Database

Using Docker Compose (recommended):
```bash
docker-compose up -d
```

Or setup manually:
- PostgreSQL: `postgresql://postgres:postgres@localhost:5432/ev_erp_dev`
- Redis: `redis://localhost:6379`

### 4. Run Migrations

```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
```

### 5. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register

Body:
{
  "companyName": "My EV Company",
  "email": "admin@company.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "admin@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Admin",
      "tenantId": "uuid"
    }
  }
}
```

#### Login
```
POST /api/auth/login

Body:
{
  "email": "admin@company.com",
  "password": "SecurePassword123"
}

Response: Same as register
```

#### Setup 2FA
```
POST /api/auth/2fa/setup
Headers: Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "message": "2FA setup initiated",
  "data": {
    "secret": "JBSWY3DPEBLW64TMMQ======",
    "qrCode": "otpauth://totp/..."
  }
}
```

#### Verify 2FA Setup
```
POST /api/auth/2fa/verify-setup
Headers: Authorization: Bearer <accessToken>

Body:
{
  "token": "123456"
}

Response:
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

#### Verify 2FA Login
```
POST /api/auth/2fa/verify-login

Body:
{
  "userId": "user-id",
  "token": "123456"
}

Response: Same as login with valid tokens
```

#### Refresh Token
```
POST /api/auth/refresh-token

Body:
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

## 🔧 Development

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Database Studio
```bash
npm run prisma:studio
```

Opens Prisma Studio GUI at `http://localhost:5555`

## 📦 Project Structure

```
src/
├── config/           # Configuration (database, redis, environment)
├── controllers/      # Request handlers
├── middleware/       # Express middleware (auth, error, logging)
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Helper functions (JWT, password, 2FA)
├── app.ts           # Express app setup
└── index.ts         # Server entry point

prisma/
└── schema.prisma    # Database schema
```

## 🔒 Security

- JWT tokens expire in 15 minutes (configurable)
- Refresh tokens expire in 7 days
- Passwords hashed with bcryptjs (10 salt rounds)
- 2FA with TOTP (30-second window)
- Input validation on all endpoints
- CORS enabled for frontend
- Audit logging on all entity changes

## 🐳 Docker

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f postgres  # PostgreSQL logs
docker-compose logs -f redis     # Redis logs
```

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | - | PostgreSQL connection string |
| REDIS_URL | - | Redis connection URL |
| JWT_SECRET | - | Secret for signing JWT |
| JWT_REFRESH_SECRET | - | Secret for refresh tokens |
| JWT_EXPIRE | 15m | Access token expiration |
| JWT_REFRESH_EXPIRE | 7d | Refresh token expiration |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment |
| CORS_ORIGIN | http://localhost:5173 | CORS allowed origin |
| TWOFACTOR_WINDOW | 2 | 2FA time window |

## 🚨 Troubleshooting

### Cannot connect to database
```bash
# Check if PostgreSQL is running
docker-compose ps

# Start if not running
docker-compose up -d postgres
```

### Cannot connect to Redis
```bash
# Check if Redis is running
docker-compose ps

# Start if not running
docker-compose up -d redis
```

### Port 5000 already in use
```bash
# Change port in .env
PORT=5001 npm run dev
```

### Prisma migration issues
```bash
# Reset database (WARNING: deletes all data)
npm run prisma:migrate reset

# Or manually reset
docker-compose down
docker volume rm backend_postgres_data
docker-compose up -d
npm run prisma:migrate
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Handbook](https://tools.ietf.org/html/rfc7519)
- [TOTP Algorithm](https://tools.ietf.org/html/rfc6238)
