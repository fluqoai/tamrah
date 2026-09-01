create or replace function private.assign_tamra_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) = 'fahad999792@gmail.com' then
    insert into public.admin_users(user_id) values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

revoke all on function private.assign_tamra_admin() from public, anon, authenticated;

drop trigger if exists on_tamra_admin_created on auth.users;
create trigger on_tamra_admin_created
after insert or update of email on auth.users
for each row execute function private.assign_tamra_admin();

insert into public.admin_users(user_id)
select id from auth.users where lower(email) = 'fahad999792@gmail.com'
on conflict (user_id) do nothing;
