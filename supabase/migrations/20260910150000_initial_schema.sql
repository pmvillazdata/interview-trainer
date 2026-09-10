create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  color text not null default 'coral',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  question text not null,
  answer text not null,
  due_at timestamptz not null default now(),
  difficulty real not null default 0,
  stability real not null default 0,
  reps integer not null default 0,
  lapses integer not null default 0,
  state text not null default 'new' check (state in ('new', 'learning', 'review', 'relearning')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  rating smallint not null check (rating between 1 and 4),
  reviewed_at timestamptz not null default now(),
  previous_due_at timestamptz,
  next_due_at timestamptz not null
);

create index decks_user_id_idx on public.decks(user_id);
create index cards_deck_id_idx on public.cards(deck_id);
create index cards_due_at_idx on public.cards(due_at);
create index review_history_user_id_reviewed_at_idx on public.review_history(user_id, reviewed_at desc);

alter table public.profiles enable row level security;
alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.review_history enable row level security;

create policy "Users can manage their profile" on public.profiles
  for all using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can manage their decks" on public.decks
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can read their cards" on public.cards
  for select using (
    exists (select 1 from public.decks where decks.id = cards.deck_id and decks.user_id = (select auth.uid()))
  );

create policy "Users can create cards in their decks" on public.cards
  for insert with check (
    exists (select 1 from public.decks where decks.id = cards.deck_id and decks.user_id = (select auth.uid()))
  );

create policy "Users can update their cards" on public.cards
  for update using (
    exists (select 1 from public.decks where decks.id = cards.deck_id and decks.user_id = (select auth.uid()))
  );

create policy "Users can delete their cards" on public.cards
  for delete using (
    exists (select 1 from public.decks where decks.id = cards.deck_id and decks.user_id = (select auth.uid()))
  );

create policy "Users can manage their review history" on public.review_history
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
