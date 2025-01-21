drop table if exists "reports";

create table
  public.reports (
    id uuid not null default gen_random_uuid (),
    departments_display text null,
    emails_display text null,
    subject text null,
    rowsort integer null,
    cc_email text null,
    columnsort integer null,
    login_filter integer null,
    completion_filter integer null,
    remove_button integer null,
    course_type_only integer null,
    ple_only integer null,
    summary_only integer null,
    profile_id uuid not null,
    date_added timestamp with time zone not null default now(),
    date_edited timestamp with time zone not null default now(),
    constraint reports_pkey primary key (id),
    constraint reports_profile_id_fkey foreign key (profile_id) references profiles (id) on delete cascade
  ) tablespace pg_default;


-- Drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS after_reports_insert ON public.reports;
DROP FUNCTION IF EXISTS add_department_on_report_insert;
DROP FUNCTION IF EXISTS add_email_on_report_insert;
DROP FUNCTION IF EXISTS add_department_email_on_report_insert;

CREATE OR REPLACE FUNCTION add_department_email_on_report_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Call the first function
    IF NEW.id IS NOT NULL THEN
        -- Insert into the report_department table
        INSERT INTO public.report_department (report_id, department_id, date_added)
        SELECT NEW.id, d.id, now()
        FROM public.departments d
        WHERE d.id IS NOT NULL;
    END IF;

    -- Call the second function
    -- Check if the new record has a valid ID
    IF NEW.id IS NOT NULL THEN
        -- Insert into the report_email table
        INSERT INTO public.report_email (report_id, department_id, date_added)
        SELECT NEW.id, e.id, now()
        FROM public.emails e
        WHERE e.id IS NOT NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_department_email_on_report_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into report_department
    IF NEW.id IS NOT NULL THEN
        INSERT INTO public.report_department (report_id, department_id, date_added)
        SELECT NEW.id, d.id, now()
        FROM public.departments d
        WHERE d.id IS NOT NULL;
    END IF;

    -- Insert into report_email
    IF NEW.id IS NOT NULL THEN
        INSERT INTO public.report_email (report_id, email_id, date_added)
        SELECT NEW.id, e.id, now()
        FROM public.emails e
        WHERE e.id IS NOT NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for the reports table
CREATE TRIGGER after_report_insert
AFTER INSERT ON public.reports
FOR EACH ROW
EXECUTE FUNCTION add_department_email_on_report_insert();
