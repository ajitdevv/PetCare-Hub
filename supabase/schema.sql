-- ─────────────────────────────────────────────────────────────────────────────
-- PetCare Hub – Supabase SQL Setup
-- Run this in: Supabase Dashboard → SQL Editor
--
-- SECTION 1: Add missing columns to EXISTING tables (safe – IF NOT EXISTS)
-- SECTION 2: Create tables from scratch (for new Supabase projects)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── SECTION 1: Migrations for existing tables ────────────────────────────────
-- MUST run this if your Supabase project already has tables from the old frontend.

-- 1a. Drop FK constraints that point to auth.users (via profiles).
--     The new app uses public.users as the auth source of truth.
ALTER TABLE IF EXISTS pets       DROP CONSTRAINT IF EXISTS pets_user_id_fkey;
ALTER TABLE IF EXISTS bookings   DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE IF EXISTS complaints DROP CONSTRAINT IF EXISTS complaints_user_id_fkey;
ALTER TABLE IF EXISTS orders     DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS profiles   DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 1b. Re-add FKs pointing to public.users (same column names, new target)
ALTER TABLE IF EXISTS pets       ADD CONSTRAINT pets_user_id_fkey       FOREIGN KEY (user_id)  REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS bookings   ADD CONSTRAINT bookings_user_id_fkey   FOREIGN KEY (user_id)  REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS complaints ADD CONSTRAINT complaints_user_id_fkey FOREIGN KEY (user_id)  REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS orders     ADD CONSTRAINT orders_user_id_fkey     FOREIGN KEY (user_id)  REFERENCES public.users(id) ON DELETE CASCADE;

-- 1c. Add missing columns to existing tables
ALTER TABLE IF EXISTS pets   ADD COLUMN IF NOT EXISTS breed text NOT NULL DEFAULT '';
ALTER TABLE IF EXISTS orders ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]';

-- 1d. Disable RLS on all tables (server uses service role key)
ALTER TABLE IF EXISTS users      DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles   DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pets       DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings   DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products   DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders     DISABLE ROW LEVEL SECURITY;


-- ── SECTION 2: Create tables from scratch (new project only) ─────────────────
-- Skip this section if your Supabase project already has these tables.

create extension if not exists "pgcrypto";

-- users (stores hashed passwords; is the auth source of truth)
create table if not exists users (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null unique,
  password    text        not null,
  role        text        not null default 'user',
  created_at  timestamptz not null default now()
);

-- profiles (FK target for all relationship tables; mirrors users without password)
create table if not exists profiles (
  id          uuid        primary key references users(id) on delete cascade,
  name        text        not null,
  email       text        not null,
  role        text        not null default 'user',
  created_at  timestamptz not null default now()
);

-- pets
create table if not exists pets (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  name        text        not null,
  type        text        not null,
  breed       text        not null default '',
  age         integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- bookings
create table if not exists bookings (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references profiles(id) on delete cascade,
  pet_id       uuid        not null references pets(id) on delete cascade,
  service_type text        not null,
  date         text        not null,
  status       text        not null default 'upcoming',
  created_at   timestamptz not null default now()
);

-- products
create table if not exists products (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  price       numeric     not null,
  category    text        not null,
  image       text        not null default '',
  description text        not null default '',
  created_at  timestamptz not null default now()
);

-- complaints (subject = short title, description = full message)
create table if not exists complaints (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  subject     text        not null default 'Support Ticket',
  description text        not null,
  status      text        not null default 'open',
  created_at  timestamptz not null default now()
);

-- orders (items stored as JSONB array)
create table if not exists orders (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references profiles(id) on delete cascade,
  items        jsonb       not null default '[]',
  total_amount numeric     not null default 0,
  status       text        not null default 'completed',
  created_at   timestamptz not null default now()
);
