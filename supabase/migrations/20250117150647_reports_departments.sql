drop table if exists "report_department";

create table
  public.report_department (
    id uuid not null default gen_random_uuid (),
    report_id uuid not null,
    department_id uuid not null,
    date_added timestamp with time zone not null default now(),
    constraint report_department_pkey primary key (id),
    constraint report_department_unique unique (report_id, department_id),
    constraint report_department_department_id_fkey foreign key (department_id) references departments (id) on delete cascade,
    constraint report_department_report_id_fkey foreign key (report_id) references reports (id) on delete cascade
  ) tablespace pg_default;