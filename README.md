# NUSlat

A gamified, Duolingo-style vocabulary learning app built with Next.js, React, Tailwind CSS, TypeScript, MongoDB, and NextAuth.js.

## Features

- 🦜 **Gamified Learning Path** – Three sequential vocabulary modules (1k, 2k, 3k words)
- 🔒 **Progressive Unlocking** – Module 2k unlocks only after completing 1k; 3k unlocks after 2k
- 🔐 **Authentication** – Sign in with Google OAuth or Email/Password via NextAuth.js v5
- ✉️ **Email Verification** – Credentials users must verify email before first sign-in
- 📬 **Daily Email Reminders** – Opt in/out to daily quiz reminder emails (Duolingo-style streak nudge)
- 🏆 **XP System** – Earn XP points as you complete modules
- 🔊 **Listen with Google TTS** – Thai word audio is served through a server-side TTS endpoint
- 🗂️ **MongoDB Vocabulary Backend** – Vocabulary cards can be loaded from MongoDB by level/chapter filters
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
- `MONGODB_DNS_SERVERS` – Optional DNS servers for SRV resolution issues (example: `8.8.8.8,1.1.1.1`)
- `AUTH_SECRET` – A random secret string (generate with `openssl rand -base64 32`)
- `AUTH_URL` – Your app URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – From [Google Cloud Console](https://console.cloud.google.com/)
- `GOOGLE_TTS_API_KEY` – Optional, enables official Google Cloud Text-to-Speech synthesis for Listen buttons
- `VOCAB_ADMIN_TOKEN` – Required to import/replace vocabulary entries via `POST /api/vocabulary`
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` – For email verification delivery
- `DAILY_NOTIFICATION_CRON_TOKEN` (or `CRON_SECRET` on Vercel) – Protects `/api/notifications/daily` reminder dispatch route

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Import Level 1 writing vocabulary to MongoDB

Level 1 writing vocabulary payload is provided in `src/data/seeds/level1-writing-vocabulary.json`.

Use the import script (reads `MONGODB_URI` from your environment or `.env.local`):

```bash
npm run import:level1-writing-vocab
```

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handlers
│   │   │   └── register/route.ts        # User registration
│   │   ├── notifications/
│   │   │   ├── daily/route.ts           # Daily reminder email dispatch (cron)
│   │   │   └── preferences/route.ts     # User opt-in/out preferences
│   │   └── milestones/route.ts          # GET/POST milestone progress
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign in page
│   │   └── signup/page.tsx             # Sign up page
│   ├── dashboard/page.tsx               # Main learning dashboard
│   └── page.tsx                         # Landing page
├── auth.ts                              # NextAuth configuration
├── components/
│   ├── Dashboard.tsx                    # Gamified dashboard component
│   ├── HomeDailyNotification.tsx        # Daily reminder opt-in card on home page
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
| ------ | ----- | ----------- |
| `POST` | `/api/auth/register` | Register a new user |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js handlers |
| `GET` | `/api/auth/verify-email` | Verify email token |
| `POST` | `/api/auth/resend-verification` | Resend verification link |
| `GET` | `/api/milestones` | Get current user's completed milestones |
| `POST` | `/api/milestones` | Mark a milestone as completed |
| `GET/POST` | `/api/notifications/preferences` | Get or update daily email reminder opt-in |
| `GET/POST` | `/api/notifications/daily` | Trigger daily reminder email dispatch (protected by cron token) |
| `GET` | `/api/vocabulary` | Get vocabulary from MongoDB (filter by `moduleId`, `chapterId`, `chapterOrder`) |
| `POST` | `/api/vocabulary` | Secure upsert import (`x-vocab-admin-token` header, optional `replaceChapters`) |
| `GET` | `/api/tts/google` | Generate playable MP3 for Listen buttons (`text`, optional `lang`) |

## Daily Reminder Cron

If you deploy on Vercel, `vercel.json` includes a daily cron that calls `/api/notifications/daily`.

- Set `CRON_SECRET` in Vercel project settings, or set `DAILY_NOTIFICATION_CRON_TOKEN`.
- The route accepts either `Authorization: Bearer <token>` or `x-daily-notification-token`.
- Users only receive one reminder per UTC day, and only when opted in.

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/new). Add all environment variables from `.env.example` to your Vercel project settings.
