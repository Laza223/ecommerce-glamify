-- Glamify Makeup - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price decimal(10,2) not null,
  compare_at_price decimal(10,2),
  cost_per_item decimal(10,2),
  sku text,
  barcode text,
  stock integer default 0,
  low_stock_threshold integer default 5,
  images text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- PRODUCT VARIANTS TABLE
-- ============================================
create table if not exists public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  name text not null,
  value text not null,
  price_adjustment decimal(10,2) default 0,
  stock integer default 0,
  sku text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- USER ADDRESSES TABLE
-- ============================================
create table if not exists public.user_addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text,
  full_name text not null,
  phone text,
  street_address text not null,
  apartment text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text default 'Argentina',
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  order_number text not null unique,
  status text default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(10,2) not null,
  shipping_cost decimal(10,2) default 0,
  tax decimal(10,2) default 0,
  total decimal(10,2) not null,
  currency text default 'ARS',
  
  -- Customer info
  customer_email text not null,
  customer_name text not null,
  customer_phone text,
  
  -- Shipping address (stored as JSONB)
  shipping_address jsonb not null,
  
  -- Mercado Pago integration
  mp_payment_id text,
  mp_preference_id text,
  mp_status text,
  
  -- Tracking
  tracking_number text,
  tracking_url text,
  
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  product_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- STORE SETTINGS TABLE
-- ============================================
create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.profiles enable row level security;
alter table public.user_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

-- Categories: Public read, admin write
create policy "Categories are viewable by everyone" on public.categories
  for select using (is_active = true);

create policy "Admins can manage categories" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products: Public read active products, admin write
create policy "Products are viewable by everyone" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Product variants: Public read, admin write
create policy "Product variants are viewable by everyone" on public.product_variants
  for select using (is_active = true);

create policy "Admins can manage product variants" on public.product_variants
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Profiles: Users can view/update own profile, admins can view all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- User addresses: Users can manage own addresses
create policy "Users can manage own addresses" on public.user_addresses
  for all using (auth.uid() = user_id);

-- Orders: Users can view own orders, admins can view all
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can create orders" on public.orders
  for insert with check (true);

create policy "Admins can manage all orders" on public.orders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order items: Same as orders
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Order items can be created with orders" on public.order_items
  for insert with check (true);

create policy "Admins can manage all order items" on public.order_items
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Store settings: Admin only
create policy "Admins can manage store settings" on public.store_settings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Apply updated_at trigger to relevant tables
create trigger update_categories_updated_at
  before update on public.categories
  for each row execute procedure public.update_updated_at_column();

create trigger update_products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at_column();

create trigger update_store_settings_updated_at
  before update on public.store_settings
  for each row execute procedure public.update_updated_at_column();

-- Function to generate order number
create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  new.order_number = 'GLM-' || to_char(now(), 'YYYYMMDD') || '-' || 
    lpad(floor(random() * 10000)::text, 4, '0');
  return new;
end;
$$;

-- Trigger to generate order number
create trigger set_order_number
  before insert on public.orders
  for each row execute procedure public.generate_order_number();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default categories
insert into public.categories (name, slug, description, display_order) values
  ('Labiales', 'labiales', 'Labiales, glosses y delineadores de labios', 1),
  ('Bases', 'bases', 'Bases, correctores y primers', 2),
  ('Ojos', 'ojos', 'Sombras, delineadores y máscaras', 3),
  ('Brochas', 'brochas', 'Brochas y accesorios de aplicación', 4),
  ('Skincare', 'skincare', 'Cuidado de la piel', 5)
on conflict (slug) do nothing;

-- Insert sample admin (you should update this with your email)
-- Run this AFTER creating your first user, then update manually:
-- update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
