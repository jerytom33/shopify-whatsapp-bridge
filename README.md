# Shopify-WhatsApp Bridge - Multi-Tenant SaaS Platform

A production-ready platform for managing Shopify order notifications via WhatsApp with multi-tenant support.

## 🚀 Features

- **Multi-Tenant Architecture** - Support multiple users with isolated configurations
- **Secure Credential Storage** - AES-256 encryption for API keys
- **Interactive Documentation** - Built-in help system and API docs
- **Real-time Activity Logs** - Track all webhook events
- **Retry Logic** - Automatic retry with exponential backoff
- **Rate Limiting** - Prevent API abuse
- **Premium UI** - Dark mode with glassmorphism design

## 📁 Project Structure

```
shopify-whatsapp-bridge/
├── backend/                 # Express.js API server
│   ├── prisma/             # Database schema
│   ├── lib/                # Prisma client
│   ├── utils/              # Encryption & auth utilities
│   └── server.js           # Main server file
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js 14 App Router
│   ├── components/         # React components
│   └── lib/                # API client
└── vercel.json             # Vercel deployment config
```

## 🔧 Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL (Neon)
- Prisma ORM
- JWT Authentication
- AES-256-CBC Encryption

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons
- Recharts

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- AOC Portal API key
- Shopify store with admin access

### Local Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd shopify-whatsapp-bridge
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure backend environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Run database migrations**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

6. **Configure frontend environment**
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
```

7. **Run development servers**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Access: http://localhost:3000

## 🌐 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure:
  - **Framework Preset:** Next.js
  - **Root Directory:** `frontend`
  - **Build Command:** `npm run build`
  - **Output Directory:** `.next`

3. **Add Environment Variables**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

4. **Deploy!**

### Backend (Railway)

1. **Create Railway Project**
- Go to [railway.app](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

2. **Configure Service**
- **Root Directory:** `backend`
- **Start Command:** `npm start`
- **Port:** 3000

3. **Add PostgreSQL**
- Click "New" → "Database" → "PostgreSQL"
- Railway automatically sets `DATABASE_URL`

4. **Add Environment Variables**
```
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
ENCRYPTION_KEY=<generate-32-byte-key>
JWT_SECRET=<generate-secret>
FRONTEND_URL=https://your-app.vercel.app
ENABLE_CORS=true
```

5. **Run Migrations**
```bash
# In Railway dashboard, run:
npx prisma migrate deploy
```

6. **Deploy!**

### Environment Variables Guide

#### Backend Required Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Security (GENERATE NEW KEYS!)
ENCRYPTION_KEY="32-character-string"
JWT_SECRET="your-secret-key"

# Frontend URL
FRONTEND_URL="https://your-app.vercel.app"
ENABLE_CORS=true

# Server Config
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
```

#### Frontend Required Variables
```env
NEXT_PUBLIC_API_URL="https://your-backend.railway.app"
```

#### Generate Secure Keys
```bash
# For ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄️ Database Setup

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to `DATABASE_URL` in backend `.env`

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings → Database
4. Add to `DATABASE_URL`

### Option 3: Railway PostgreSQL
- Automatically provided when you add PostgreSQL service
- No manual setup needed

## 📖 Usage

### 1. Create Account
- Visit your deployed frontend
- Sign up (once auth is implemented)

### 2. Configure Credentials
- Go to Settings page
- Enter Shopify webhook secret
- Enter AOC Portal API key
- Enter WhatsApp sender number
- Save configuration

### 3. Get Webhook URL
- Copy your unique webhook URL from Settings
- Format: `https://your-backend.com/webhooks/{userId}/orders/create`

### 4. Add to Shopify
- Go to Shopify Admin → Settings → Notifications
- Scroll to Webhooks
- Add webhook:
  - Event: Order creation
  - URL: Your unique webhook URL
  - Format: JSON

### 5. Test Integration
- Use Test page to send test order
- Or place actual order in Shopify
- Check Activity page for results

## 🔐 Security

- All API keys encrypted with AES-256-CBC
- Passwords hashed with bcrypt (10 rounds)
- JWT authentication with 7-day expiry
- HMAC signature verification for webhooks
- Rate limiting (100 req/15min)
- CORS protection
- Environment variable validation

## 📚 Documentation

Built-in documentation available at `/docs`:
- Getting Started guide
- Configuration instructions
- Webhook setup
- API reference
- Troubleshooting
- Security best practices

## 💬 Support

Built-in help system available at `/help`:
- 30+ FAQ questions
- Searchable help center
- Category filtering
- Contact form
- Live support channels

## 🛠️ Development

### Database Commands
```bash
# Create migration
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Build Commands
```bash
# Backend
cd backend
npm start

# Frontend (dev)
cd frontend
npm run dev

# Frontend (production build)
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

### Webhook not received
- Verify webhook URL is correct in Shopify
- Check backend logs
- Ensure server is publicly accessible
- Verify HMAC secret matches

### WhatsApp not sending
- Verify AOC API key is active
- Check template is approved
- Ensure phone number format is correct
- Check sender number is registered

### Database connection issues
- Verify DATABASE_URL is correct
- Check database is accessible
- Run migrations: `npx prisma migrate deploy`

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Contact

For support, visit the built-in Help page or contact support@shopify-bridge.com

---

Built with ❤️ for seamless Shopify-WhatsApp integration
