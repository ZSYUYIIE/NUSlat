# NUSlat

A gamified, Duolingo-style vocabulary learning app built with Next.js, React, Tailwind CSS, TypeScript, MongoDB, and NextAuth.js.

## Features

- 🦜 **Gamified Learning Path** – Three sequential vocabulary modules (1k, 2k, 3k words)
- 🔒 **Progressive Unlocking** – Module 2k unlocks only after completing 1k; 3k unlocks after 2k
- 🔐 **Authentication** – Sign in with Google OAuth or Email/Password via NextAuth.js v5
- ✉️ **Email Verification** – Credentials users must verify email before first sign-in
- 🏆 **XP System** – Earn XP points as you complete modules
- 📱 **Fully Responsive** – Works on mobile, tablet, and desktop

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **MongoDB** with Mongoose
- **NextAuth.js v5** (Google + Credentials providers)
- **bcryptjs** for password hashing

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/ZSYUYIIE/NUSlat.git
cd NUSlat
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` – Your MongoDB connection string
- `AUTH_SECRET` – A random secret string (generate with `openssl rand -base64 32`)
- `AUTH_URL` – Your app URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – From [Google Cloud Console](https://console.cloud.google.com/)
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` – For email verification delivery

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handlers
│   │   │   └── register/route.ts        # User registration
│   │   └── milestones/route.ts          # GET/POST milestone progress
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign in page
│   │   └── signup/page.tsx             # Sign up page
│   ├── dashboard/page.tsx               # Main learning dashboard
│   └── page.tsx                         # Landing page
├── auth.ts                              # NextAuth configuration
├── components/
│   ├── Dashboard.tsx                    # Gamified dashboard component
│   └── ModuleCard.tsx                   # Module card with lock logic
├── lib/
│   ├── db.ts                            # MongoDB connection utility
│   └── modules.ts                       # Module definitions (1k, 2k, 3k)
├── models/
│   └── User.ts                          # Mongoose User schema
└── types/
    └── next-auth.d.ts                   # NextAuth type augmentation
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js handlers |
| `GET` | `/api/auth/verify-email` | Verify email token |
| `POST` | `/api/auth/resend-verification` | Resend verification link |
| `GET` | `/api/milestones` | Get current user's completed milestones |
| `POST` | `/api/milestones` | Mark a milestone as completed |

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/new). Add all environment variables from `.env.example` to your Vercel project settings.
