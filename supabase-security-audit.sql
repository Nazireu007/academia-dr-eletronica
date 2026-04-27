-- Auditoria rapida para rodar no SQL Editor do Supabase depois de aplicar supabase-schema.sql.
-- Este arquivo nao altera dados: ele lista admins atuais e falha se policies criticas ficarem inseguras.

select
  user_id,
  email,
  full_name,
  role,
  updated_at
from public.member_profiles
where role = 'admin'
order by updated_at desc;

select
  tablename,
  policyname,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('member_profiles', 'course_access', 'member_states')
order by tablename, policyname;

do $$
declare
  profiles_rls boolean;
  course_access_rls boolean;
  member_states_rls boolean;
  profiles_insert_check text;
  profiles_update_check text;
  profiles_admin_update_qual text;
  profiles_admin_update_check text;
  course_insert_check text;
  course_update_qual text;
  course_update_check text;
  course_delete_qual text;
begin
  select relrowsecurity
    into profiles_rls
  from pg_class
  where oid = 'public.member_profiles'::regclass;

  select relrowsecurity
    into course_access_rls
  from pg_class
  where oid = 'public.course_access'::regclass;

  select relrowsecurity
    into member_states_rls
  from pg_class
  where oid = 'public.member_states'::regclass;

  if not coalesce(profiles_rls, false) then
    raise exception 'RLS desligado em public.member_profiles.';
  end if;

  if not coalesce(course_access_rls, false) then
    raise exception 'RLS desligado em public.course_access.';
  end if;

  if not coalesce(member_states_rls, false) then
    raise exception 'RLS desligado em public.member_states.';
  end if;

  select with_check
    into profiles_insert_check
  from pg_policies
  where schemaname = 'public'
    and tablename = 'member_profiles'
    and policyname = 'profiles_upsert_own';

  select with_check
    into profiles_update_check
  from pg_policies
  where schemaname = 'public'
    and tablename = 'member_profiles'
    and policyname = 'profiles_update_own';

  select qual, with_check
    into profiles_admin_update_qual, profiles_admin_update_check
  from pg_policies
  where schemaname = 'public'
    and tablename = 'member_profiles'
    and policyname = 'profiles_update_admin';

  if coalesce(profiles_insert_check, '') not ilike '%auth.uid() = user_id%'
    or coalesce(profiles_insert_check, '') not ilike '%role = ''student''%' then
    raise exception 'profiles_upsert_own nao esta travando role = student.';
  end if;

  if coalesce(profiles_update_check, '') not ilike '%auth.uid() = user_id%'
    or coalesce(profiles_update_check, '') not ilike '%role = ''student''%' then
    raise exception 'profiles_update_own nao esta travando role = student.';
  end if;

  if coalesce(profiles_admin_update_qual, '') not ilike '%is_admin%'
    or coalesce(profiles_admin_update_check, '') not ilike '%is_admin%' then
    raise exception 'profiles_update_admin nao esta restrita a is_admin().';
  end if;

  select with_check
    into course_insert_check
  from pg_policies
  where schemaname = 'public'
    and tablename = 'course_access'
    and policyname = 'course_access_insert_admin';

  select qual, with_check
    into course_update_qual, course_update_check
  from pg_policies
  where schemaname = 'public'
    and tablename = 'course_access'
    and policyname = 'course_access_update_admin';

  select qual
    into course_delete_qual
  from pg_policies
  where schemaname = 'public'
    and tablename = 'course_access'
    and policyname = 'course_access_delete_admin';

  if coalesce(course_insert_check, '') not ilike '%is_admin%' then
    raise exception 'course_access_insert_admin nao esta restrita a is_admin().';
  end if;

  if coalesce(course_update_qual, '') not ilike '%is_admin%'
    or coalesce(course_update_check, '') not ilike '%is_admin%' then
    raise exception 'course_access_update_admin nao esta restrita a is_admin().';
  end if;

  if coalesce(course_delete_qual, '') not ilike '%is_admin%' then
    raise exception 'course_access_delete_admin nao esta restrita a is_admin().';
  end if;

  raise notice 'OK: policies criticas de admin e RLS estao ativas.';
end $$;
