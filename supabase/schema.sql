create extension if not exists "pgcrypto";

create type age_group as enum ('minor', 'adult');
create type sport_type as enum ('ski', 'snowboard', 'both', 'mixed');
create type connection_status as enum ('pending', 'accepted', 'blocked');
create type meetup_status as enum ('draft', 'open', 'full', 'completed', 'cancelled');
create type meetup_type as enum ('public_open', 'public_approval', 'private');
create type meetup_age_pool as enum ('minor_only', 'adult_only', 'connections_only');
create type join_request_status as enum ('pending', 'approved', 'rejected', 'cancelled');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text,
  bio text,
  home_mountain text,
  sport_type sport_type not null default 'ski',
  skill_level text,
  avatar_url text,
  latitude double precision,
  longitude double precision,
  age_group age_group not null default 'adult',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status connection_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  constraint connections_unique_pair unique (requester_id, addressee_id),
  constraint connections_no_self_connection check (requester_id <> addressee_id)
);

create table if not exists public.meetups (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  mountain_name text not null,
  scheduled_for timestamptz not null,
  meeting_point text,
  max_group_size integer,
  skill_level text,
  meetup_type meetup_type not null default 'public_open',
  sport_type sport_type not null default 'mixed',
  notes text,
  age_pool meetup_age_pool not null default 'adult_only',
  invited_profile_ids uuid[] not null default '{}',
  latitude double precision,
  longitude double precision,
  status meetup_status not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meetup_participants (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid not null references public.meetups (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'participant',
  joined_at timestamptz not null default timezone('utc', now()),
  constraint meetup_participants_unique_member unique (meetup_id, profile_id)
);

create table if not exists public.meetup_join_requests (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid not null references public.meetups (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status join_request_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  constraint meetup_join_requests_unique_request unique (meetup_id, profile_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid references public.meetups (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint messages_target_check check (
    meetup_id is not null or recipient_id is not null
  )
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid not null references public.meetups (id) on delete cascade,
  rater_id uuid not null references public.profiles (id) on delete cascade,
  rated_profile_id uuid not null references public.profiles (id) on delete cascade,
  score integer not null check (score between 1 and 5),
  review text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint ratings_unique_pair unique (meetup_id, rater_id, rated_profile_id),
  constraint ratings_no_self check (rater_id <> rated_profile_id)
);

create table if not exists public.video_posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  caption text,
  video_url text not null,
  thumbnail_url text,
  mountain_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tracked_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  distance_meters numeric(10, 2),
  vertical_meters numeric(10, 2),
  average_speed_mps numeric(10, 2),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.route_points (
  id uuid primary key default gen_random_uuid(),
  tracked_session_id uuid not null references public.tracked_sessions (id) on delete cascade,
  recorded_at timestamptz not null,
  latitude double precision not null,
  longitude double precision not null,
  elevation_meters numeric(10, 2),
  speed_mps numeric(10, 2)
);

create index if not exists meetups_host_id_idx on public.meetups (host_id);
create index if not exists meetups_scheduled_for_idx on public.meetups (scheduled_for);
create index if not exists meetup_participants_meetup_id_idx on public.meetup_participants (meetup_id);
create index if not exists meetup_join_requests_meetup_id_idx on public.meetup_join_requests (meetup_id);
create index if not exists messages_meetup_id_idx on public.messages (meetup_id);
create index if not exists messages_recipient_id_idx on public.messages (recipient_id);
create index if not exists video_posts_profile_id_idx on public.video_posts (profile_id);
create index if not exists tracked_sessions_profile_id_idx on public.tracked_sessions (profile_id);
create index if not exists route_points_tracked_session_id_idx on public.route_points (tracked_session_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists meetups_set_updated_at on public.meetups;
create trigger meetups_set_updated_at
before update on public.meetups
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.connections enable row level security;
alter table public.meetups enable row level security;
alter table public.meetup_participants enable row level security;
alter table public.meetup_join_requests enable row level security;
alter table public.messages enable row level security;
alter table public.ratings enable row level security;
alter table public.video_posts enable row level security;
alter table public.tracked_sessions enable row level security;
alter table public.route_points enable row level security;

create policy "profiles_select_all_authenticated" on public.profiles
for select to authenticated
using (true);

create policy "profiles_insert_self" on public.profiles
for insert to authenticated
with check (auth.uid() = id);

create policy "profiles_update_self" on public.profiles
for update to authenticated
using (auth.uid() = id);

create policy "connections_manage_own" on public.connections
for all to authenticated
using (auth.uid() = requester_id or auth.uid() = addressee_id)
with check (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "meetups_select_all_authenticated" on public.meetups
for select to authenticated
using (true);

create policy "meetups_insert_host" on public.meetups
for insert to authenticated
with check (auth.uid() = host_id);

create policy "meetups_update_host" on public.meetups
for update to authenticated
using (auth.uid() = host_id);

create policy "meetup_participants_visible_to_authenticated" on public.meetup_participants
for select to authenticated
using (
  auth.uid() = profile_id
  or exists (
    select 1
    from public.meetups m
    where m.id = meetup_participants.meetup_id and m.host_id = auth.uid()
  )
);

create policy "meetup_participants_manage_own" on public.meetup_participants
for all to authenticated
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "meetup_join_requests_manage_own" on public.meetup_join_requests
for insert to authenticated
with check (auth.uid() = profile_id);

create policy "meetup_join_requests_select_self_or_host" on public.meetup_join_requests
for select to authenticated
using (
  auth.uid() = profile_id
  or exists (
    select 1
    from public.meetups m
    where m.id = meetup_join_requests.meetup_id and m.host_id = auth.uid()
  )
);

create policy "meetup_join_requests_update_self_or_host" on public.meetup_join_requests
for update to authenticated
using (
  auth.uid() = profile_id
  or exists (
    select 1
    from public.meetups m
    where m.id = meetup_join_requests.meetup_id and m.host_id = auth.uid()
  )
)
with check (
  auth.uid() = profile_id
  or exists (
    select 1
    from public.meetups m
    where m.id = meetup_join_requests.meetup_id and m.host_id = auth.uid()
  )
);

create policy "messages_visible_to_members" on public.messages
for select to authenticated
using (
  auth.uid() = sender_id
  or auth.uid() = recipient_id
  or exists (
    select 1
    from public.meetup_participants mp
    where mp.meetup_id = messages.meetup_id and mp.profile_id = auth.uid()
  )
);

create policy "messages_insert_sender" on public.messages
for insert to authenticated
with check (auth.uid() = sender_id);

create policy "ratings_visible_to_authenticated" on public.ratings
for select to authenticated
using (true);

create policy "ratings_insert_rater" on public.ratings
for insert to authenticated
with check (auth.uid() = rater_id);

create policy "video_posts_visible_to_authenticated" on public.video_posts
for select to authenticated
using (true);

create policy "video_posts_manage_own" on public.video_posts
for all to authenticated
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "tracked_sessions_manage_own" on public.tracked_sessions
for all to authenticated
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "route_points_visible_for_owner" on public.route_points
for select to authenticated
using (
  exists (
    select 1
    from public.tracked_sessions ts
    where ts.id = route_points.tracked_session_id and ts.profile_id = auth.uid()
  )
);

create policy "route_points_insert_for_owner" on public.route_points
for insert to authenticated
with check (
  exists (
    select 1
    from public.tracked_sessions ts
    where ts.id = route_points.tracked_session_id and ts.profile_id = auth.uid()
  )
);

-- Notes for implementation:
-- 1. Public stranger discovery age gating should be enforced in application queries or a secure view
--    by comparing profiles.age_group to meetups.age_pool.
-- 2. Private meetup visibility should be restricted to invited_profile_ids and accepted connections.
--    That connection-aware rule is left to the application layer in this pass.
