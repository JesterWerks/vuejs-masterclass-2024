drop table if exists "emails";

create table
  public.emails (
    id uuid not null default gen_random_uuid (),
    email_address text not null,
    date_added timestamp with time zone not null default now(),
    date_edited timestamp with time zone not null default now(),
    constraint emails_pkey primary key (id)
  ) tablespace pg_default;
