create table if not exists public.unit_images (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  public_url text not null,
  storage_path text,
  alt_ar text not null default '',
  alt_en text not null default '',
  sort_order smallint not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create index if not exists unit_images_unit_sort_idx
  on public.unit_images(unit_id, sort_order);

alter table public.unit_images enable row level security;

grant select on table public.unit_images to anon, authenticated;
grant insert, update, delete on table public.unit_images to authenticated;

create policy "published unit images are public"
on public.unit_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.units
    where units.id = unit_images.unit_id
      and (units.is_published or (select private.is_admin()))
  )
);

create policy "admins insert unit images"
on public.unit_images for insert
to authenticated
with check ((select private.is_admin()));

create policy "admins update unit images"
on public.unit_images for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins delete unit images"
on public.unit_images for delete
to authenticated
using ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'unit-images',
  'unit-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins upload unit images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'unit-images' and (select private.is_admin()));

create policy "admins update unit images storage"
on storage.objects for update
to authenticated
using (bucket_id = 'unit-images' and (select private.is_admin()))
with check (bucket_id = 'unit-images' and (select private.is_admin()));

create policy "admins delete unit images storage"
on storage.objects for delete
to authenticated
using (bucket_id = 'unit-images' and (select private.is_admin()));

create or replace function private.register_tamra_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) = 'fahad999792@gmail.com' then
    insert into public.admin_users(user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists register_tamra_admin_after_signup on auth.users;
create trigger register_tamra_admin_after_signup
after insert or update of email on auth.users
for each row execute function private.register_tamra_admin();

insert into public.admin_users(user_id)
select id from auth.users where lower(email) = 'fahad999792@gmail.com'
on conflict (user_id) do nothing;

insert into public.unit_images (unit_id, public_url, alt_ar, alt_en, sort_order)
select u.id, image.public_url, image.alt_ar, image.alt_en, image.sort_order
from public.units u
cross join (values
  ('/images/living-window.jpeg', 'الصالة بإطلالة هادئة', 'Bright living room', 0),
  ('/images/master-bedroom.jpeg', 'غرفة النوم الرئيسية', 'Master bedroom', 1),
  ('/images/living-dining.jpeg', 'مساحة المعيشة والطعام', 'Living and dining space', 2),
  ('/images/twin-bedroom.jpeg', 'غرفة السريرين', 'Twin bedroom', 3),
  ('/images/kitchen.jpeg', 'المطبخ', 'Kitchen', 4),
  ('/images/living-room.jpeg', 'غرفة المعيشة', 'Living room', 5),
  ('/images/dining.jpeg', 'منطقة الطعام', 'Dining area', 6),
  ('/images/master-window.jpeg', 'جلسة غرفة النوم', 'Bedroom seating', 7),
  ('/images/living-night.jpeg', 'أجواء المساء', 'Evening ambience', 8)
) as image(public_url, alt_ar, alt_en, sort_order)
where u.slug = 'tamra-apartment-1'
  and not exists (
    select 1 from public.unit_images existing
    where existing.unit_id = u.id and existing.public_url = image.public_url
  );
+

create or replace function private.check_unit_availability_internal(
  requested_unit_id uuid,
  requested_check_in date,
  requested_check_out date,
  requested_guests integer
)
returns table(available boolean, nights integer, nightly_rate_sar integer, total_sar integer)
language sql
stable
security definer
set search_path = ''
as $$
  select requested_check_in >= current_date
    and requested_check_out > requested_check_in
    and requested_guests between 1 and u.max_guests
    and not exists (select 1 from public.bookings b where b.unit_id=u.id and b.status in ('pending_payment','confirmed') and b.stay_dates && daterange(requested_check_in,requested_check_out,'[)'))
    and not exists (select 1 from public.blocked_dates d where d.unit_id=u.id and d.blocked_period && daterange(requested_check_in,requested_check_out,'[)')) as available,
    (requested_check_out-requested_check_in)::integer as nights,
    u.base_price_sar as nightly_rate_sar,
    greatest((requested_check_out-requested_check_in)::integer,0)*u.base_price_sar as total_sar
  from public.units u where u.id=requested_unit_id and u.is_published=true;
$$;

revoke all on function private.check_unit_availability_internal(uuid,date,date,integer) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;
grant execute on function private.check_unit_availability_internal(uuid,date,date,integer) to anon, authenticated;

create or replace function public.check_unit_availability(
  requested_unit_id uuid,
  requested_check_in date,
  requested_check_out date,
  requested_guests integer
)
returns table(available boolean, nights integer, nightly_rate_sar integer, total_sar integer)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.check_unit_availability_internal(requested_unit_id, requested_check_in, requested_check_out, requested_guests);
$$;

grant execute on function public.check_unit_availability(uuid,date,date,integer) to anon, authenticated;
