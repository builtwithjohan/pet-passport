# Pet Passport — Backend & Database Setup Guide

This guide explains how to stand up the production backend database and connect Cloudflare Pages / Workers to Supabase.

---

## 1. Database Provisioning (Supabase / PostgreSQL)

1. Open your [Supabase Dashboard](https://database.new) and create a new project.
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Paste the complete contents of [`backend/schema.sql`](file:///Users/bhasskarscore/src/Pet%20Passport/backend/schema.sql).
4. Click **Run** to execute the script. This will create:
   - `profiles`, `pets`, `vaccinations`, `documents`, `checklist_progress`, and `pet_shares` tables.
   - Row Level Security (RLS) policies for complete data isolation.
   - Indexes and `updated_at` automated trigger functions.

---

## 2. Cloudflare Pages & Environment Variables

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Workers & Pages** -> **Pages**.
2. Select your `pet-passport` project.
3. Go to **Settings** -> **Environment variables**.
4. Add the following environment variables (from your Supabase API Settings):
   - `VITE_SUPABASE_URL`: `https://<your-project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-anon-public-key>`
5. Trigger a deployment or push to main. Cloudflare Pages will build and serve the application globally on the Cloudflare edge network.

---

## 3. Local Development with Supabase Backend

Create a `.env` file in the root project directory:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```
Run `npm run dev` to launch the local Vite dev server connected to the cloud backend.
