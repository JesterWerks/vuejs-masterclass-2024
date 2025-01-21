drop table if exists "emails";

create table
  public.emails (
    id uuid not null default gen_random_uuid (),
    email_address text not null,
    date_added timestamp with time zone not null default now(),
    date_edited timestamp with time zone not null default now(),
    constraint emails_pkey primary key (id),
    constraint emails_email_address_key unique (email_address)
  ) tablespace pg_default;

DROP TRIGGER IF EXISTS after_emails_insert ON public.emails;
DROP Function IF EXISTS add_report_email_on_email_insert;

CREATE OR REPLACE FUNCTION add_report_email_on_email_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id IS NOT NULL THEN
        INSERT INTO public.report_email (report_id, email_id, date_added)
        SELECT r.id, NEW.id, now()
        FROM public.reports r
        WHERE NEW.id IS NOT NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger after_email_insert
after insert on emails for each row
execute function add_report_email_on_email_insert ();