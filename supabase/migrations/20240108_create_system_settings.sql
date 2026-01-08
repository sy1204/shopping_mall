-- Create system_settings table
create table if not exists public.system_settings (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  value text,
  category text check (category in ('basic', 'policy')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Policies
create policy "Settings are public readable"
  on public.system_settings for select
  using (true);

create policy "Admins can insert settings"
  on public.system_settings for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update settings"
  on public.system_settings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete settings"
  on public.system_settings for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
