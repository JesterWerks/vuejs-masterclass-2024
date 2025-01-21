drop table if exists "departments";

create table
  public.departments (
    id uuid not null default gen_random_uuid (),
    name text not null,
    date_added timestamp with time zone not null default now(),
    date_edited timestamp with time zone not null default now(),
    constraint departments_pkey primary key (id)
  ) tablespace pg_default;

DROP TRIGGER IF EXISTS after_departments_insert ON public.departments;
DROP Function IF EXISTS add_report_department_on_department_insert;

CREATE OR REPLACE FUNCTION add_report_department_on_department_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id IS NOT NULL THEN
        INSERT INTO public.report_department (report_id, department_id, date_added)
        SELECT r.id, NEW.id, now()
        FROM public.reports r
        WHERE NEW.id IS NOT NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger after_department_insert
after insert on departments for each row
execute function add_report_department_on_department_insert ();