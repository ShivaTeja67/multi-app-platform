# MERN Multi-App Platform with SSO

A production-ready MERN stack featuring three independent React apps with unified authentication across different ports/domains.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- Git Bash (Windows)

### Setup

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Ensure MongoDB is running:**
```bash
# Option 1: Docker
docker-compose up -d mongodb

# Option 2: Local MongoDB service
mongod
```

3. **Start all services:**
```bash
npm run dev
```

4. **Access the apps:**
- Main App (Login/Register): http://localhost:3000
- Dashboard App: http://localhost:3001
- Store App: http://localhost:3002

## Architecture

### Frontend Apps (Vite + React)
- **main-app** (Port 3000): Landing, Login, Register, Home
- **dashboard-app** (Port 3001): Protected dashboard with stats & activity
- **store-app** (Port 3002): Protected store with products & cart

### Backend Services (Express)
- **auth-service** (Port 4000): JWT auth, users, sessions
- **dashboard-service** (Port 4001): Stats and activity data
- **store-service** (Port 4002): Products and cart management

### Database
- **MongoDB**: User accounts, sessions, and data storage

## Authentication Strategy

### Why JWT with HTTP-Only Cookies?
- **Security**: HTTP-only cookies prevent XSS attacks by keeping tokens inaccessible to JavaScript.
- **SSO Capability**: Cookies set with a shared domain (e.g., `localhost` in dev) are shared across ports, enabling seamless SSO.
- **Stateless**: JWTs are self-contained, reducing server-side session storage needs.
- **Refresh Tokens**: Separate short-lived access tokens and long-lived refresh tokens for better security and user experience.

### Implementation Details
- Access tokens expire in 15 minutes; refresh tokens in 7 days.
- Cookies use `SameSite` policies for cross-site protection.
- Session invalidation on logout ensures security.
- CORS configured to allow credentials from app origins.

## Key Features

✅ **SSO Across Apps**: Login once, accessible everywhere  
✅ **HTTP-Only Cookies**: Secure token storage  
✅ **Session Management**: Logout invalidates all sessions  
✅ **Protected Routes**: Dashboard & Store require authentication  
✅ **Shopping Cart**: Per-user in-memory storage  
✅ **Mock Data**: Pre-populated products and stats  
✅ **Responsive UI**: Modern CSS with animations  

## Project Structure

```
multi-app-platform/
├── services/
│   ├── auth-service/
│   ├── dashboard-service/
│   └── store-service/
├── apps/
│   ├── main-app/
│   ├── dashboard-app/
│   └── store-app/
├── nginx/
├── docker-compose.yml
└── package.json
```

## Development Commands

```bash
# Start all services
npm run dev

# Start individual services
npm run dev:auth
npm run dev:dashboard
npm run dev:store
npm run dev:main
npm run dev:dashboard-app
npm run dev:store-app

# Build for production
npm run build
```

## Verification Checklist

- [ ] Register new account on main-app (localhost:3000)
- [ ] After registration, automatically logged in on main-app
- [ ] Navigate to dashboard-app (localhost:3001) without logging in - still authenticated
- [ ] Navigate to store-app (localhost:3002) without logging in - still authenticated
- [ ] Add items to cart in store-app
- [ ] Logout from any app - logged out everywhere
- [ ] Try accessing dashboard-app while logged out - redirected to login

## API Documentation

The complete API documentation is available in OpenAPI/Swagger format:

- **Swagger JSON**: [`swagger.json`](swagger.json) - Complete API specification for all services
- **View Online**: You can import `swagger.json` into [Swagger Editor](https://editor.swagger.io/) or [Swagger UI](https://swagger.io/tools/swagger-ui/) for interactive documentation

The documentation covers all endpoints for:
- Authentication Service (User management, JWT tokens)
- Dashboard Service (Stats, activity, settings)
- Store Service (Products, shopping cart)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_DOMAIN=.myplatform.local
```

### dashboard-service/.env & store-service/.env
```
PORT=4001
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

## Production Deployment

1. Update `COOKIE_DOMAIN` to your actual domain
2. Set `secure: true` for HTTPS
3. Generate strong JWT_SECRET
4. Configure MongoDB Atlas connection string
5. Set `NODE_ENV=production`
6. Use Nginx/load balancer for routing

## Troubleshooting

**Cookies not persisting across subdomains?**
- Ensure `.env` has correct `COOKIE_DOMAIN`
- Clear browser cookies and restart

**401 Unauthorized on protected routes?**
- Check that auth-service is running on port 4000
- Verify CORS credentials configuration
- Check browser DevTools → Application → Cookies

**MongoDB connection error?**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name matches

## License

MIT
