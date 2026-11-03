-- Execute no SQL editor do Supabase.
-- Depois crie o usuário de autenticação e cadastre o UUID em portfolio_owners.

create table if not exists public.portfolio_owners (
  id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now(),
  email_sent boolean not null default false
);

create table if not exists public.featured_projects (
  id uuid primary key default gen_random_uuid(),
  repo_name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.portfolio_owners enable row level security;
alter table public.messages enable row level security;
alter table public.featured_projects enable row level security;

revoke all on public.portfolio_owners, public.messages, public.featured_projects from anon, authenticated;

grant select on public.portfolio_owners to authenticated;
grant select, update on public.messages to authenticated;
grant select on public.featured_projects to anon, authenticated;
grant insert, delete on public.featured_projects to authenticated;

create policy if not exists owner_self on public.portfolio_owners
  for select to authenticated
  using (id = auth.uid());

create policy if not exists owner_messages_read on public.messages
  for select to authenticated
  using (exists (
    select 1 from public.portfolio_owners where id = auth.uid()
  ));

create policy if not exists owner_messages_update on public.messages
  for update to authenticated
  using (exists (
    select 1 from public.portfolio_owners where id = auth.uid()
  ))
  with check (exists (
    select 1 from public.portfolio_owners where id = auth.uid()
  ));

create policy if not exists owner_featured_insert on public.featured_projects
  for insert to authenticated
  with check (exists (
    select 1 from public.portfolio_owners where id = auth.uid()
  ));

create policy if not exists owner_featured_delete on public.featured_projects
  for delete to authenticated
  using (exists (
    select 1 from public.portfolio_owners where id = auth.uid()
  ));

-- Exemplo de cadastro do usuário autorizado:
-- insert into public.portfolio_owners (id) values ('COLE-O-UUID-REAL-AQUI');
