-- Migration: Add verification_codes table for email verification during checkout
-- This replaces the in-memory storage that doesn't work on Vercel serverless

create table if not exists public.verification_codes (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  code text not null,
  expires_at timestamp with time zone not null,
  used boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for quick lookups
create index if not exists idx_verification_codes_email on public.verification_codes(email);

-- Enable RLS
alter table public.verification_codes enable row level security;

-- Allow anyone to insert (needed for guest checkout)
create policy "Anyone can create verification codes" on public.verification_codes
  for insert with check (true);

-- Allow reading own codes (by email match - handled via service role in API)
-- We use service role in the API, so no select policy needed for anon
create policy "Service role can manage verification codes" on public.verification_codes
  for all using (true);

-- Auto-cleanup: delete expired codes (optional, can be done via cron)
-- For now, the API will handle cleanup on verification
