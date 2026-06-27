# Frontend Setup & User Guide

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment

Create `.env.local`:
```bash
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📱 Available Pages

- `/` - Root (redirects to dashboard or login)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected, requires login)
- `/vehicles` - Vehicle inventory (Phase 2)
- `/inventory` - Spare parts inventory (Phase 2)

## 🎨 UI Components

### Authentication Components
- `LoginForm` - Login form with email/password
- `SignupForm` - Registration form with company details
- `ProtectedRoute` - Route wrapper for authenticated pages

### Layout Components
- `Layout` - Main layout with sidebar and header
  - Sidebar navigation
  - User menu with logout
  - Dark mode toggle (Phase 2)

### Pages
- `Login` - Login page
- `Register` - Registration page
- `Dashboard` - Main dashboard with KPI cards
- `NotFound` - 404 page

## 🔐 State Management (Redux)

### Auth Store
```typescript
authSlice
  ├── user: User | null
  ├── isAuthenticated: boolean
  ├── accessToken: string | null
  ├── refreshToken: string | null
  ├── loading: boolean
  └── error: string | null
```

### Custom Hook: `useAuth`
```typescript
const {
  user,
  isAuthenticated,
  accessToken,
  refreshToken,
  loading,
  error,
  register,      // Register new user
  login,          // Login user
  logout,         // Logout user
} = useAuth();
```

## 🔌 API Integration

### API Client
All API calls go through `axios` instance with:
- Automatic token injection
- Token refresh on 401 response
- Request/response interception

### Services
- `authService.register()` - Register user
- `authService.login()` - Login user
- `authService.setupTwoFA()` - Setup 2FA
- `authService.verifyTwoFASetup()` - Verify 2FA
- `authService.verifyTwoFALogin()` - Verify 2FA code
- `authService.refreshToken()` - Refresh access token

## 🛠️ Development

### Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## 📦 Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── LoginForm.tsx           # Login form
│   ├── SignupForm.tsx          # Signup form
│   └── ProtectedRoute.tsx      # Route protection
│
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Registration page
│   ├── Dashboard.tsx           # Dashboard page
│   └── NotFound.tsx            # 404 page
│
├── store/
│   ├── store.ts                # Redux store config
│   └── authSlice.ts            # Auth reducer
│
├── services/
│   ├── api.ts                  # Axios instance
│   └── auth.service.ts         # Auth API calls
│
├── hooks/
│   └── useAuth.ts              # Auth custom hook
│
├── types/
│   └── auth.ts                 # TypeScript types
│
├── App.tsx                     # Main app component
├── main.tsx                    # React entry point
└── index.css                   # Global styles
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Responsive**: Mobile-first design

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
}
```

## 🔐 Authentication Flow

### Registration
1. User fills signup form
2. Submit to `/api/auth/register`
3. Backend creates tenant + user
4. Tokens returned and stored
5. Redirect to dashboard

### Login
1. User enters email & password
2. Submit to `/api/auth/login`
3. If 2FA enabled, show 2FA prompt
4. Submit 2FA code
5. Tokens returned and stored
6. Redirect to dashboard

### Token Refresh
- Access token expires after 15 minutes
- Automatic refresh on 401 response
- Refresh token valid for 7 days
- On refresh token expiration, redirect to login

## 🐛 Troubleshooting

### Cannot connect to backend
```bash
# Check if backend is running
# Backend should be on http://localhost:5000

# Update VITE_API_URL in .env.local if needed
VITE_API_URL=http://localhost:5000
```

### Tailwind styles not applying
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

### Vite hot reload not working
```bash
# Check vite.config.ts HMR configuration
# Or restart dev server
npm run dev
```

## 📝 Development Tips

### Local Storage
- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token

### Redux DevTools
Install Redux DevTools browser extension to debug state changes.

### Network Tab
Use browser DevTools Network tab to inspect API calls.

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Build command
npm run build

# Output directory
dist
```

### Environment Variables for Production
```env
VITE_API_URL=https://api.yourdomain.com
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
