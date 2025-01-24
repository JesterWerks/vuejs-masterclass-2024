import { supabase } from '@/lib/supabaseClient';
import type { QueryData } from '@supabase/supabase-js';

// Profiles Queries
export const profilesQuery = supabase
  .from('profiles')
  .select(`
    *,
    reports:reports(id, subject, date_added)
  `);

export type Profiles = QueryData<typeof profilesQuery>;

export const profileForAuthQuery = async ({ column, value }: { column: string; value: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq(column, value)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data;
};

export type Profile = QueryData<ReturnType<typeof profileForAuthQuery>>;

// Reports Queries
export const reportsQuery = supabase
  .from('reports')
  .select(`
    *,
    reports_departments (
      department_id,
      departments (id, name, date_added)
    ),
    reports_emails (
      email_id,
      emails (id, email_address, date_added)
    )
  `);

export type Reports = QueryData<typeof reportsQuery>;

export const reportQuery = (reportId: string) =>
  supabase
    .from('reports')
    .select(`
      *,
      departments:reports_departments(
        department_id,
        departments(id, name, date_added)
      ),
      emails:reports_emails(
        email_id,
        emails(id, email_address, date_added)
      ),
      profile:profiles(id, full_name)
    `)
    .eq('id', reportId)
    .single();

export type Report = QueryData<ReturnType<typeof reportQuery>>;

// Departments Queries
export const departmentsQuery = supabase
  .from('departments')
  .select(`
    *,
    reports:reports_departments(
      report_id,
      reports(id, subject, date_added)
    )
  `);

export type Departments = QueryData<typeof departmentsQuery>;

export const departmentQuery = (id: string) =>
  supabase
    .from('departments')
    .select(`
      *,
      reports:reports_departments(
        report_id,
        reports(id, subject, date_added)
      )
    `)
    .eq('id', id)
    .single();

export type Department = QueryData<ReturnType<typeof departmentQuery>>;

// Emails Queries
export const emailsQuery = supabase
  .from('emails')
  .select(`
    *,
    reports:reports_emails(
      report_id,
      reports(id, subject, date_added)
    )
  `);

export type Emails = QueryData<typeof emailsQuery>;

export const emailQuery = (id: string) =>
  supabase
    .from('emails')
    .select(`
      *,
      reports:reports_emails(
        report_id,
        reports(id, subject, date_added)
      )
    `)
    .eq('id', id)
    .single();

export type Email = QueryData<ReturnType<typeof emailQuery>>;
