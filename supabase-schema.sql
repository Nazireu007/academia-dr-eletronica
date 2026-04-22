create extension if not exists pgcrypto;

create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text not null default 'Aluno',
  goal text not null default 'dominar fundamentos',
  rhythm text not null default '30 min por dia',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.course_access (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  access_status text not null default 'pending' check (access_status in ('pending', 'active', 'blocked')),
  granted_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, course_slug)
);

create table if not exists public.member_states (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, course_slug)
);

create index if not exists idx_course_access_course_slug on public.course_access (course_slug);

alter table public.member_profiles enable row level security;
alter table public.course_access enable row level security;
alter table public.member_states enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.member_profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "profiles_select_own" on public.member_profiles;
create policy "profiles_select_own"
on public.member_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_select_admin" on public.member_profiles;
create policy "profiles_select_admin"
on public.member_profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "profiles_upsert_own" on public.member_profiles;
create policy "profiles_upsert_own"
on public.member_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.member_profiles;
create policy "profiles_update_own"
on public.member_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_admin" on public.member_profiles;
create policy "profiles_update_admin"
on public.member_profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profiles_delete_admin" on public.member_profiles;
create policy "profiles_delete_admin"
on public.member_profiles
for delete
to authenticated
using (public.is_admin());

drop policy if exists "course_access_select_own" on public.course_access;
create policy "course_access_select_own"
on public.course_access
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "course_access_select_admin" on public.course_access;
create policy "course_access_select_admin"
on public.course_access
for select
to authenticated
using (public.is_admin());

drop policy if exists "course_access_insert_admin" on public.course_access;
create policy "course_access_insert_admin"
on public.course_access
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "course_access_update_admin" on public.course_access;
create policy "course_access_update_admin"
on public.course_access
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "course_access_delete_admin" on public.course_access;
create policy "course_access_delete_admin"
on public.course_access
for delete
to authenticated
using (public.is_admin());

drop policy if exists "member_states_select_own" on public.member_states;
create policy "member_states_select_own"
on public.member_states
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "member_states_insert_own" on public.member_states;
create policy "member_states_insert_own"
on public.member_states
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "member_states_update_own" on public.member_states;
create policy "member_states_update_own"
on public.member_states
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "member_states_delete_admin" on public.member_states;
create policy "member_states_delete_admin"
on public.member_states
for delete
to authenticated
using (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_member_profiles_updated_at on public.member_profiles;
create trigger trg_member_profiles_updated_at
before update on public.member_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_course_access_updated_at on public.course_access;
create trigger trg_course_access_updated_at
before update on public.course_access
for each row
execute function public.set_updated_at();

drop trigger if exists trg_member_states_updated_at on public.member_states;
create trigger trg_member_states_updated_at
before update on public.member_states
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_profiles (user_id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, 'Aluno'), '@', 1), 'Aluno')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.admin_remove_member(target_user_id uuid, target_course_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem remover inscritos.';
  end if;

  if auth.uid() = target_user_id then
    raise exception 'Nao e permitido remover a propria conta administradora.';
  end if;

  delete from public.member_states
  where user_id = target_user_id
    and course_slug = target_course_slug;

  delete from public.course_access
  where user_id = target_user_id
    and course_slug = target_course_slug;

  delete from public.member_profiles
  where user_id = target_user_id;
end;
$$;

comment on table public.course_access is
'Defina access_status = active para liberar o curso ao aluno autenticado.';

comment on column public.member_profiles.role is
'Use admin para habilitar o painel administrativo e gerenciar acessos.';
