create type public.app_role as enum ('admin','compliance_officer','investigator','employee');

create table public.profiles (
  id uuid primary key,
  name text not null default '',
  email text not null default '',
  department text not null default 'Legal & Compliance',
  title text not null default 'Team member',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "roles self read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), coalesce(new.email,''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'admin')
  on conflict (user_id, role) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table public.departments (
  id text primary key, name text not null, manager text not null,
  employees integer not null default 0, region text not null default ''
);
create table public.app_users (
  id text primary key, name text not null, email text not null,
  role text not null default 'employee', department text not null,
  status text not null default 'active', "lastActivity" text not null default '',
  title text not null default ''
);
create table public.complaints (
  id text primary key, ref text not null, title text not null, description text not null default '',
  reporter text not null default 'Anonymous', anonymous boolean not null default false,
  department text not null default '', category text not null default '',
  priority text not null default 'medium', status text not null default 'open',
  assignee text, "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now(),
  "relatedPeople" text not null default '', timeline jsonb not null default '[]'::jsonb, comments jsonb not null default '[]'::jsonb
);
create table public.investigations (
  id text primary key, ref text not null, title text not null, "complaintId" text,
  investigator text not null default '', department text not null default '',
  status text not null default 'planning', priority text not null default 'medium',
  "openedAt" timestamptz not null default now(), "dueAt" timestamptz not null default now(),
  findings text not null default '', timeline jsonb not null default '[]'::jsonb
);
create table public.risks (
  id text primary key, ref text not null, title text not null, description text not null default '',
  department text not null default '', owner text not null default '',
  likelihood integer not null default 1, impact integer not null default 1,
  status text not null default 'open', mitigation text not null default '',
  "reviewDate" timestamptz not null default now(), timeline jsonb not null default '[]'::jsonb
);
create table public.evidence (
  id text primary key, name text not null, type text not null default '', size text not null default '',
  uploader text not null default '', "uploadedAt" timestamptz not null default now(),
  "linkedTo" text not null default '', "linkedLabel" text not null default '',
  "accessLog" jsonb not null default '[]'::jsonb
);
create table public.notifications (
  id text primary key, title text not null, body text not null default '',
  at timestamptz not null default now(), read boolean not null default false,
  kind text not null default 'system', href text not null default '/dashboard'
);
create table public.audit_logs (
  id text primary key, at timestamptz not null default now(), "user" text not null default 'System',
  action text not null, entity text not null default '', "entityId" text not null default '',
  department text not null default '', ip text not null default 'Web', result text not null default 'success'
);

do $$
declare t text;
begin
  foreach t in array array['departments','app_users','complaints','investigations','risks','evidence','notifications','audit_logs']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "read all" on public.%I for select to authenticated using (true)', t);
    execute format('create policy "write all" on public.%I for insert to authenticated with check (true)', t);
    execute format('create policy "update all" on public.%I for update to authenticated using (true)', t);
  end loop;
end $$;