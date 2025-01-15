drop table if exists "reports";

create table
  "reports" (
    id bigint primary key generated always as identity not null,
    report_id bigint null,
    departments_display text null,
    emails_display text null,
    subject text null,
    rowsort int null,
    cc_email text null,
    columnsort int null,
    login_filter int null,
    completion_filter int null,
    remove_button int null,
    course_type_only int null,
    ple_only int null,
    summary_only int null,
    profile_id uuid references profiles (id) on delete cascade not null,
    date_added timestamptz default NOW() not null,
    date_edited timestamptz default NOW() not null
  )