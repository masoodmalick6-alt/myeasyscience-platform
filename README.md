# MyEasyScience full platform starter

A full-stack starter for **myeasyscience.com** built with Next.js, TypeScript, Tailwind CSS and Supabase.

## Included
- Responsive MyEasyScience homepage and course library
- Supabase email/password registration and login
- Protected student dashboard
- Starter Chemistry, Biology, Physics and Mathematics courses
- Lesson viewer with saved lesson completion
- Interactive science quiz with saved attempts
- Supabase schema with row-level security (RLS)
- Free/premium membership field and student/admin role foundation

## Requirements
- Node.js 20.9 or later
- A Supabase account and project
- A hosting account (Vercel is a straightforward option)

## Run locally
1. Extract the ZIP and open the project folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`.
4. In Supabase, open **Project Settings → API** and copy the Project URL and anon/public key into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
5. In Supabase, open **SQL Editor**, paste and run `supabase/schema.sql`.
6. In Supabase Authentication settings, configure the Site URL and allowed redirect URLs for local development (`http://localhost:3000`) and your eventual production domain.
7. Start the app:
   ```bash
   npm run dev
   ```
8. Visit http://localhost:3000, create an account, open a course, complete lessons and try the dashboard quiz.

## Deploy
1. Push the project to a private or public Git repository.
2. Import it into Vercel.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in Vercel project settings.
4. Deploy, then add your custom domain `myeasyscience.com` in Vercel and update DNS records at your domain registrar.
5. Update Supabase Authentication Site URL and redirect URL allowlist to use your production domain.

## Important setup and security notes
- Do not put a Supabase service-role key in browser code or commit secrets.
- RLS policies ensure each student can read and write only their own progress and quiz records.
- The starter includes a `membership_tier` field, but it does **not** process payments or automatically grant premium access. Add a payment provider and a trusted server-side webhook before selling memberships.
- The `role` field is a foundation for admin tools. Before launching admin functions, add server-side role checks and admin-only RLS policies; never rely on hiding buttons in the browser.
- Starter lesson content and quiz questions are examples. Replace them with reviewed, age-appropriate curriculum content.
- This is a functional foundation, not a finished production deployment. Test authentication, email confirmation, RLS, backups, privacy policy, terms and accessibility before inviting students.
- If your audience includes children, review applicable child privacy and parental-consent requirements for the countries where you operate before collecting personal information.
