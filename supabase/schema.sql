-- Run this in the Supabase SQL Editor to create all required tables.

create extension if not exists "pgcrypto";

-- Users
create table if not exists users (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null unique,
  password    text        not null,
  role        text        not null default 'user',
  created_at  timestamptz not null default now()
);

-- Pets
create table if not exists pets (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  type        text        not null,
  breed       text        not null default '',
  age         integer     not null default 0,
  owner       uuid        not null references users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Bookings
create table if not exists bookings (
  id           uuid        primary key default gen_random_uuid(),
  pet_id       uuid        not null references pets(id) on delete cascade,
  user_id      uuid        not null references users(id) on delete cascade,
  service_type text        not null,
  date         text        not null,
  status       text        not null default 'upcoming',
  created_at   timestamptz not null default now()
);

-- Products
create table if not exists products (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  price       numeric     not null,
  category    text        not null,
  image       text        not null default '',
  description text        not null default '',
  created_at  timestamptz not null default now()
);

-- Complaints
create table if not exists complaints (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references users(id) on delete cascade,
  message     text        not null,
  status      text        not null default 'Pending',
  created_at  timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references users(id) on delete cascade,
  items        jsonb       not null default '[]',
  total_amount numeric     not null default 0,
  status       text        not null default 'completed',
  created_at   timestamptz not null default now()
);

-- Disable RLS on all tables (server uses service role key which bypasses it anyway)
alter table users     disable row level security;
alter table pets      disable row level security;
alter table bookings  disable row level security;
alter table products  disable row level security;
alter table complaints disable row level security;
alter table orders    disable row level security;
