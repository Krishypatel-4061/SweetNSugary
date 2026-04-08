# 🎂 Sweet N Sugary — Home Bakery Web App

> **Jamnagar's premium home bakery** — Custom Cakes & Desserts, ordered online.
> Built with **Next.js 14**, **React Three Fiber (3D)**, **Neon PostgreSQL**, and **Gemini AI**.

---

## 🌐 Live Demo

| URL | Notes |
|-----|-------|
| `http://localhost:3000` | Local development |

### 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@sweetnsugary.com` | `admin123` |
| **Customer** | `user@sweetnsugary.com` | `user123` |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏠 **Landing Page** | Animated hero, features, about, testimonials, Instagram gallery |
| 🍰 **3D Cake Builder** | Real-time 3D configurator — pick flavor, tiers, size, toppings, edible prints |
| 🤖 **AI Match** | Upload an inspiration photo → Gemini Vision auto-configures the cake |
| 📋 **Menu** | Filterable product grid with categories |
| 📦 **Admin Dashboard** | Kanban board showing orders by status (Pending → Baking → Ready → Completed) |
| 💬 **WhatsApp Updates** | Admin sends pre-filled order status messages via WhatsApp |
| 🔐 **Auth System** | JWT-based login with HTTP-only cookies, role-based access control |
| 📱 **Responsive** | Mobile-first design with slide-down mobile navigation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + custom design tokens |
| **3D Rendering** | React Three Fiber + @react-three/drei |
| **Animation** | Framer Motion |
| **Database** | Neon PostgreSQL (serverless) |
| **Auth** | bcryptjs (hashing) + jsonwebtoken (JWT) + HTTP-only cookies |
| **AI** | Google Gemini Vision API |
| **Fonts** | Playfair Display (serif) + Lato (sans-serif) |

---

## 📁 Project Structure

```
sweetnsugary/
├── app/
│   ├── page.tsx              # Landing page (homepage)
│   ├── layout.tsx            # Root layout (Navbar, Footer, fonts, SEO)
│   ├── globals.css           # Global styles + animation utilities
│   ├── login/                # Login page
│   ├── menu/                 # Menu page + layout
│   ├── builder/              # 3D Cake Builder page + server actions
│   ├── contact/              # Contact page
│   ├── admin/                # Admin dashboard + Kanban + products
│   └── api/
│       ├── auth/             # login, logout, me endpoints
│       └── analyze-cake-image/ # Gemini AI image analysis endpoint
├── components/
│   ├── Navbar.tsx            # Responsive nav with auth-aware links
│   ├── Footer.tsx            # Site footer with contact & social
│   ├── MicroInteraction.tsx  # Reusable Framer Motion scroll-trigger wrapper
│   ├── CakeBuilder.tsx       # 3D interactive cake configurator
│   └── admin/
│       ├── OrderKanban.tsx   # Drag-free Kanban board for orders
│       └── WhatsAppButton.tsx # Pre-filled WhatsApp message action
├── lib/
│   ├── db.ts                 # Shared PostgreSQL connection pool
│   └── auth.ts               # bcrypt + JWT + cookie session utilities
├── scripts/
│   ├── migrate-schema.ts     # Creates DB tables (run once)
│   ├── seed-users.ts         # Seeds admin + demo user
│   ├── seed-initial-data.ts  # Seeds products and categories
│   └── seed-inventory.ts     # Seeds inventory records
└── middleware.ts             # Edge middleware — protects /admin routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd sweetnsugary
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
DATABASE_URL="your-neon-postgres-connection-string"
GEMINI_API_KEY="your-google-gemini-api-key"
JWT_SECRET="a-long-random-secret-string"
```

### 3. Set Up Database
```bash
# Create tables
npx ts-node scripts/migrate-schema.ts

# Seed demo users
npx ts-node scripts/seed-users.ts

# Seed products
npx ts-node scripts/seed-initial-data.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Stores accounts (admin + customers) with bcrypt-hashed passwords |
| `products` | Menu items with name, category, price, images |
| `orders` | Customer orders with status (pending/baking/ready/completed) |
| `cake_designs` | Saved 3D cake configurations from the builder |
| `inventory` | Stock levels for ingredients |

---

## 🔐 Authentication Flow

1. User submits email + password on `/login`
2. `/api/auth/login` verifies against DB using `bcrypt.compare`
3. On success, a JWT is signed and stored as an **HTTP-only cookie** (`auth_token`)
4. `middleware.ts` checks the cookie on every `/admin/*` request
5. Server components verify the JWT using `getSession()` and check the `role` field

---

## 🤖 AI Cake Analysis Flow

1. User uploads an inspiration photo in the Cake Builder
2. Image is sent to `/api/analyze-cake-image` as `multipart/form-data`
3. The server encodes the image to base64 and calls the **Gemini Vision API**
4. Gemini returns structured JSON: `{ baseFlavor, color, scale, tiers, toppings }`
5. The frontend applies these values to the 3D configurator state

---

*© Sweet N Sugary — Made with Love in Jamnagar, Gujarat 🍰*
