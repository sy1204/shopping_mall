-- WARNING: THIS SCRIPT WILL DELETE ALL EXISTING DATA
-- Run this if you want to start fresh with the correct schema

DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.inquiries CASCADE;
DROP TABLE IF EXISTS public.items CASCADE; -- In case order_items table exists with different name
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.notices CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  phone_number text,
  role text default 'customer' check (role in ('admin', 'customer')),
  points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 2. PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text not null,
  price integer not null,
  original_price integer,
  discount_rate integer default 0,
  category text,
  images text[],
  is_best boolean default false,
  is_new boolean default false,
  story_content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Products
alter table public.products enable row level security;
create policy "Products are viewable by everyone." on public.products for select using (true);
create policy "Admins can insert products." on public.products for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update products." on public.products for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete products." on public.products for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  total_price integer not null,
  status text default 'Pending',
  shipping_address jsonb,
  items jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Orders
alter table public.orders enable row level security;
create policy "Users can view own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders." on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders." on public.orders for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update orders." on public.orders for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 4. INQUIRIES
create table public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  type text check (type in ('product', 'oneday', 'general')),
  product_id uuid references public.products(id),
  title text,
  content text,
  answer text,
  category text,
  is_secret boolean default false,
  status text default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Inquiries
alter table public.inquiries enable row level security;
create policy "Users can view own inquiries." on public.inquiries for select using (auth.uid() = user_id or is_secret = false);
create policy "Admins can view all inquiries." on public.inquiries for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Users can insert inquiries." on public.inquiries for insert with check (auth.uid() = user_id);
create policy "Admins can update inquiries (answer)." on public.inquiries for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 5. REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  product_id uuid references public.products(id),
  rating integer check (rating >= 1 and rating <= 5),
  content text,
  images text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;
create policy "Reviews are public." on public.reviews for select using (true);
create policy "Users can insert reviews." on public.reviews for insert with check (auth.uid() = user_id);

-- 6. NOTICES & FAQS
create table public.notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  category text,
  author text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.faqs (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  category text
);

alter table public.notices enable row level security;
alter table public.faqs enable row level security;
create policy "Public read access." on public.notices for select using (true);
create policy "Public read access faqs." on public.faqs for select using (true);
create policy "Admins write access." on public.notices for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
