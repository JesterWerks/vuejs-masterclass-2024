drop table if exists "report_email";

create table
  public.report_email (
    id uuid not null default gen_random_uuid (),
    report_id uuid not null,
    email_id uuid not null,
    date_added timestamp with time zone not null default now(),
    constraint report_email_pkey primary key (id),
    constraint report_email_unique unique (report_id, email_id),
    constraint report_email_email_id_fkey foreign key (email_id) references emails (id) on delete cascade,
    constraint report_email_report_id_fkey foreign key (report_id) references reports (id) on delete cascade
  ) tablespace pg_default;
