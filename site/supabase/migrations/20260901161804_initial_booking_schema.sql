create extension if not exists btree_gist with schema extensions;

create schema if not exists private;
revoke all on schema private from public;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  city_ar text not null,
  city_en text not null,
  district_ar text not null,
  district_en text not null,
  maps_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  base_price_sar integer not null check (base_price_sar > 0),
  max_guests smallint not null check (max_guests between 1 and 30),
  bedrooms smallint not null check (bedrooms >= 0),
  bathrooms smallint not null check (bathrooms >= 0),
  check_in_time time not null default '16:00',
  check_out_time time not null default '12:00',
  free_cancellation_hours integer not null default 24 check (free_cancellation_hours >= 0),
  late_cancellation_fee_sar integer not null default 150 check (late_cancellation_fee_sar >= 0),
  amenities jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete restrict,
  booking_reference text not null unique,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  check_in date not null,
  check_out date not null,
  guest_count smallint not null check (guest_count > 0),
  nightly_rate_sar integer not null check (nightly_rate_sar > 0),
  subtotal_sar integer not null check (subtotal_sar >= 0),
  cancellation_fee_sar integer not null default 150 check (cancellation_fee_sar >= 0),
  total_sar integer not null check (total_sar >= 0),
  status text not null default 'pending_payment' check (status in ('pending_payment','confirmed','cancelled','completed','expired')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','partially_refunded','refunded','failed')),
  payment_provider text,
  payment_reference text,
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  stay_dates daterange generated always as (daterange(check_in, check_out, '[)')) stored,
  constraint bookings_valid_dates check (check_out > check_in),
  constraint bookings_no_overlap exclude using gist (
    unit_id with =,
    stay_dates with &&
  ) where (status in ('pending_payment','confirmed'))
);

create table public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  blocked_period daterange generated always as (daterange(start_date, end_date, '[)')) stored,
  constraint blocked_dates_valid_range check (end_date > start_date),
  constraint blocked_dates_no_overlap exclude using gist (unit_id with =, blocked_period with &&)
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid())
    );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.admin_users enable row level security;

grant select on public.properties, public.units to anon, authenticated;
grant select, insert, update, delete on public.properties, public.units, public.bookings, public.blocked_dates to authenticated;
grant select on public.admin_users to authenticated;

create policy "published properties are public"
on public.properties for select to anon, authenticated
using (is_published or (select private.is_admin()));

create policy "published units are public"
on public.units for select to anon, authenticated
using (is_published or (select private.is_admin()));

create policy "admins insert properties" on public.properties for insert to authenticated with check ((select private.is_admin()));
create policy "admins update properties" on public.properties for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete properties" on public.properties for delete to authenticated using ((select private.is_admin()));

create policy "admins insert units" on public.units for insert to authenticated with check ((select private.is_admin()));
create policy "admins update units" on public.units for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete units" on public.units for delete to authenticated using ((select private.is_admin()));

create policy "admins manage bookings"
on public.bookings for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins manage blocked dates"
on public.blocked_dates for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins view admin list"
on public.admin_users for select to authenticated
using ((select private.is_admin()));

create index bookings_unit_status_idx on public.bookings(unit_id, status);
create index bookings_check_in_idx on public.bookings(check_in);
create index blocked_dates_unit_idx on public.blocked_dates(unit_id);
create index units_property_idx on public.units(property_id);

insert into public.properties (
  id, slug, name_ar, name_en, city_ar, city_en, district_ar, district_en, maps_url, is_published
) values (
  'd9ed2caa-3444-4cb0-b79c-8a01134e4c13', 'tamra-jeddah', 'تمرة للضيافة', 'Tamra Hospitality',
  'جدة', 'Jeddah', 'حي الأصيل، شمال جدة', 'Al Aseel, North Jeddah',
  'https://maps.app.goo.gl/nikK3osVvY5LBjAC7?g_st=ic', true
);

insert into public.units (
  id, property_id, slug, title_ar, title_en, description_ar, description_en,
  base_price_sar, max_guests, bedrooms, bathrooms, amenities, is_published
) values (
  '80c9be6e-4ea0-44be-883f-7ae53e117335',
  'd9ed2caa-3444-4cb0-b79c-8a01134e4c13',
  'tamra-apartment-1',
  'شقة تمرة العائلية',
  'Tamra Family Apartment',
  'شقة عائلية دافئة في شمال جدة تضم غرفتي نوم وحمامين ومطبخًا وصالة وغرفة معيشة وبلكونة وموقفًا خاصًا مظللًا.',
  'A warm family apartment in North Jeddah with two bedrooms, two bathrooms, a kitchen, lounge, living room, balcony, and private shaded parking.',
  400, 5, 2, 2,
  '["kitchen","living_room","lounge","balcony","private_shaded_parking","two_bathrooms"]'::jsonb,
  true
);

create or replace function public.check_unit_availability(
  requested_unit_id uuid,
  requested_check_in date,
  requested_check_out date,
  requested_guests integer
)
returns table (available boolean, nights integer, nightly_rate_sar integer, total_sar integer)
language sql
stable
security definer
set search_path = ''
as $$
  select
    requested_check_in >= current_date
    and requested_check_out > requested_check_in
    and requested_guests between 1 and u.max_guests
    and not exists (
      select 1 from public.bookings b
      where b.unit_id = u.id
        and b.status in ('pending_payment','confirmed')
        and b.stay_dates && daterange(requested_check_in, requested_check_out, '[)')
    )
    and not exists (
      select 1 from public.blocked_dates d
      where d.unit_id = u.id
        and d.blocked_period && daterange(requested_check_in, requested_check_out, '[)')
    ) as available,
    (requested_check_out - requested_check_in)::integer as nights,
    u.base_price_sar as nightly_rate_sar,
    greatest((requested_check_out - requested_check_in)::integer, 0) * u.base_price_sar as total_sar
  from public.units u
  where u.id = requested_unit_id and u.is_published = true;
$$;

revoke all on function public.check_unit_availability(uuid,date,date,integer) from public;
grant execute on function public.check_unit_availability(uuid,date,date,integer) to anon, authenticated;
