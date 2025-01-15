drop table if exists "departments";

create table
  public.departments (
    id bigint generated always as identity not null,
    "name" text not null,
    report_id bigint null,
    profile_id uuid references profiles (id) on delete cascade not null,
    date_added timestamp with time zone not null default now(),
    date_edited timestamp with time zone not null default now(),
    collaborators text array default array[]::varchar[] not null,
    constraint departments_pkey primary key (id),
    constraint departments_report_id_fkey foreign key (report_id) references reports (id) on delete cascade
  ) tablespace pg_default;