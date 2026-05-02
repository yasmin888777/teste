-- ══════════════════════════════════════════════
--  DigitUly SaaS — Schema completo
-- ══════════════════════════════════════════════

-- 1. WORKSPACES (cada agência/empresa é um workspace)
create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  logo_url text,
  created_at timestamptz default now()
);

-- 2. WORKSPACE MEMBERS (quem pertence a qual workspace e com qual papel)
create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member', -- 'owner', 'admin', 'member'
  name text,
  avatar_url text,
  created_at timestamptz default now(),
  unique(workspace_id, user_id)
);

-- 3. BRANDS (marcas por workspace)
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  color text default '#3b7ef8',
  logo_url text,
  goal_confirmed int default 0,
  goal_videos int default 0,
  notes text,
  created_at timestamptz default now()
);

-- 4. TEAM MEMBERS (membros da equipe — rastreados no dashboard)
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  role text default 'support', -- 'owner', 'admin', 'support'
  avatar_url text,
  brands uuid[] default '{}',
  created_at timestamptz default now()
);

-- 5. CAMPAIGNS (campanhas por marca)
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  name text not null,
  period text,
  status text default 'ongoing', -- 'ongoing', 'finished'
  goal_confirmed int default 0,
  goal_videos int default 0,
  samples int default 0,
  shipment_status int default 0,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

-- 6. DAILY LOGS (atividade diária por membro por marca)
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  member_id uuid references team_members(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  date date not null default current_date,
  kols_contacted int default 0,
  confirmed int default 0,
  videos_published int default 0,
  created_at timestamptz default now(),
  unique(member_id, brand_id, date)
);

-- 7. KOLS (influenciadores por workspace)
create table if not exists kols (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  name text not null,
  instagram text,
  ig_url text,
  tiktok text,
  youtube text,
  niche text,
  sub1 text,
  sub2 text,
  lang text default 'pt',
  location text,
  status text default 'available', -- 'available', 'in_campaign', 'curadoria'
  bio text,
  ig_followers int default 0,
  tk_followers int default 0,
  yt_followers int default 0,
  gender text,
  age text,
  aud_location text,
  formats text[] default '{}',
  price text,
  available text default 'sim',
  platform text default 'instagram',
  deliverable text default 'reel',
  created_at timestamptz default now()
);

-- 8. KOL SCHEDULES (agendamentos de publicação)
create table if not exists kol_schedules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  kol_id uuid references kols(id) on delete cascade,
  kol_name text,
  platform text,
  deliverable text,
  scheduled_date date,
  scheduled_time time,
  status text default 'scheduled', -- 'scheduled', 'published', 'cancelled'
  created_at timestamptz default now()
);

-- 9. LINKS / DOCUMENTS (notas e links por workspace)
create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  title text not null,
  url text,
  category text,
  year text,
  notes text,
  created_at timestamptz default now()
);

-- ══════════════════════════════════════════════
--  ROW LEVEL SECURITY (cada um vê só os seus dados)
-- ══════════════════════════════════════════════

alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table brands enable row level security;
alter table team_members enable row level security;
alter table campaigns enable row level security;
alter table daily_logs enable row level security;
alter table kols enable row level security;
alter table kol_schedules enable row level security;
alter table links enable row level security;

-- Função auxiliar: retorna os workspace_ids do usuário logado
create or replace function my_workspace_ids()
returns setof uuid language sql security definer as $$
  select workspace_id from workspace_members where user_id = auth.uid();
$$;

-- POLICIES — workspaces
create policy "ver próprio workspace" on workspaces
  for select using (id in (select my_workspace_ids()));

create policy "criar workspace" on workspaces
  for insert with check (true);

create policy "editar próprio workspace" on workspaces
  for update using (id in (select my_workspace_ids()));

-- POLICIES — workspace_members
create policy "ver membros do workspace" on workspace_members
  for select using (workspace_id in (select my_workspace_ids()));

create policy "entrar no workspace" on workspace_members
  for insert with check (user_id = auth.uid());

create policy "editar membro" on workspace_members
  for update using (workspace_id in (select my_workspace_ids()));

create policy "remover membro" on workspace_members
  for delete using (workspace_id in (select my_workspace_ids()));

-- POLICIES — brands
create policy "ver brands" on brands
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar brand" on brands
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar brand" on brands
  for update using (workspace_id in (select my_workspace_ids()));
create policy "deletar brand" on brands
  for delete using (workspace_id in (select my_workspace_ids()));

-- POLICIES — team_members
create policy "ver team" on team_members
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar membro" on team_members
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar membro time" on team_members
  for update using (workspace_id in (select my_workspace_ids()));
create policy "deletar membro time" on team_members
  for delete using (workspace_id in (select my_workspace_ids()));

-- POLICIES — campaigns
create policy "ver campanhas" on campaigns
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar campanha" on campaigns
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar campanha" on campaigns
  for update using (workspace_id in (select my_workspace_ids()));
create policy "deletar campanha" on campaigns
  for delete using (workspace_id in (select my_workspace_ids()));

-- POLICIES — daily_logs
create policy "ver logs" on daily_logs
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar log" on daily_logs
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar log" on daily_logs
  for update using (workspace_id in (select my_workspace_ids()));

-- POLICIES — kols
create policy "ver kols" on kols
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar kol" on kols
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar kol" on kols
  for update using (workspace_id in (select my_workspace_ids()));
create policy "deletar kol" on kols
  for delete using (workspace_id in (select my_workspace_ids()));

-- POLICIES — kol_schedules
create policy "ver agendamentos" on kol_schedules
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar agendamento" on kol_schedules
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar agendamento" on kol_schedules
  for update using (workspace_id in (select my_workspace_ids()));
create policy "deletar agendamento" on kol_schedules
  for delete using (workspace_id in (select my_workspace_ids()));

-- POLICIES — links
create policy "ver links" on links
  for select using (workspace_id in (select my_workspace_ids()));
create policy "criar link" on links
  for insert with check (workspace_id in (select my_workspace_ids()));
create policy "editar link" on links
  for update using (workspace_id in (select my_workspace_ids()));
create policy "deletar link" on links
  for delete using (workspace_id in (select my_workspace_ids()));
