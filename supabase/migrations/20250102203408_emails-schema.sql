drop table if exists "emails";

create table
  public.emails (
    id bigint generated always as identity not null,
    email text null,
    report_id bigint null,
    profile_id uuid references profiles (id) on delete cascade not null,
    date_added timestamp with time zone not null default now(),
    date_edited timestamp with time zone not null default now(),
    collaborators text array default array[]::varchar[] not null,
    constraint emails_pkey primary key (id),
    constraint emails_report_id_fkey foreign key (report_id) references reports (id) on delete cascade
  ) tablespace pg_default;