# OnlyYums 🍽️

A production-ready Next.js app to discover the best food places across top US cities.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Add environment variables to `.env.local`
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. Set up database
   ```bash
   supabase db push
   # Or manually run supabase/init.sql in Supabase dashboard
   ```

4. Run the app
   ```bash
   npm run dev
   ```

Visit http://localhost:3000

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Clerk Auth
- TypeScript
- Zod validation

## Routes

| Route | Auth |
|-------|------|
| `/` | No |
| `/cities` | No |
| `/cities/[slug]` | No |
| `/places/[id]` | No |
| `/sign-in` | No |
| `/sign-up` | No |
| `/dashboard` | Yes |

## Scripts

```bash
npm run dev        # Development
npm run build      # Production build
npm start          # Start production
npm run setup:db   # Setup database
```
