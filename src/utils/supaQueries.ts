import { supabase } from '@/lib/supabaseClient'
// import type { CreateNewTask } from '@/types/CreateNewForm'
import type { CreateNewReport } from '@/types/CreateNewForm'
import type { CreateNewEmail } from '@/types/CreateNewForm'
import type { CreateNewDepartment } from '@/types/CreateNewForm'
import type { QueryData } from '@supabase/supabase-js'
import type { UUID } from 'crypto'

// export const tasksWithProjectsQuery = supabase.from('tasks').select(`
//   *,
//   projects (
//     id,
//     name,
//     slug
//   )
//   `)
// export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>

// export const projectsQuery = supabase.from('projects').select()
// export type Projects = QueryData<typeof projectsQuery>

// export const projectQuery = (slug: string) =>
//   supabase
//     .from('projects')
//     .select(
//       `
//   *,
//   tasks (
//     id,
//     name,
//     status,
//     due_date
//   )
// `,
//     )
//     .eq('slug', slug)
//     .single()

// export type Project = QueryData<ReturnType<typeof projectQuery>>

// export const updateProjectQuery = (updatedProject = {}, id: number) => {
//   return supabase.from('projects').update(updatedProject).eq('id', id)
// }

// export const taskQuery = (id: string) => {
//   return supabase
//     .from('tasks')
//     .select(
//       `
//     *,
//     projects (
//       id,
//       name,
//       slug
//     )
//     `,
//     )
//     .eq('id', id)
//     .single()
// }

// export type Task = QueryData<ReturnType<typeof taskQuery>>

// export const updateTaskQuery = (updatedTask = {}, id: number) => {
//   return supabase.from('tasks').update(updatedTask).eq('id', id)
// }

// export const deleteTaskQuery = (id: number) => {
//   return supabase.from('tasks').delete().eq('id', id)
// }

export const profileQuery = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select().eq(column, value).single()
}

export const profilesQuery = supabase.from('profiles').select(`id, full_name`)

export const groupedProfilesQuery = (userIds: string[]) =>
  supabase.from('profiles').select('username, avatar_url, id, full_name').in('id', userIds)
export type Collabs = QueryData<ReturnType<typeof groupedProfilesQuery>>

// export const createNewTaskQuery = (newTask: CreateNewTask) => {
//   return supabase.from('tasks').insert(newTask)
// }

export const createNewReportQuery = (newReport: CreateNewReport) => {
  return supabase.from('reports').insert(newReport)
}

export const updateReportQuery = (updatedReport = {}, id: UUID) => {
  return supabase.from('reports').update(updatedReport).eq('id', id)
}

export const deleteReportQuery = (id: UUID) => {
  return supabase.from('reports').delete().eq('id', id)
}

export const createNewDepartmentQuery = (newDepartment: CreateNewDepartment) => {
  return supabase.from('departments').insert(newDepartment)
}

export const updateDepartmentQuery = (updatedDepartment = {}, id: UUID) => {
  return supabase.from('departments').update(updatedDepartment).eq('id', id)
}

export const deleteDepartmentQuery = (id: UUID) => {
  return supabase.from('departments').delete().eq('id', id)
}

export const createNewEmailQuery = (newEmail: CreateNewEmail) => {
  return supabase.from('emails').insert(newEmail)
}

export const updatEmailQuery = (updatedEmail = {}, id: UUID) => {
  return supabase.from('emails').update(updatedEmail).eq('id', id)
}

export const deletEmailQuery = (id: UUID) => {
  return supabase.from('emails').delete().eq('id', id)
}

export const groupedDepartmentsQuery = (departments: number[]) =>
  supabase.from('departments').select('id, name').in('id', departments)
export type GroupedDepartments = QueryData<ReturnType<typeof groupedDepartmentsQuery>>

export const groupedEmailsQuery = (emails: string[]) =>
  supabase.from('emails').select('id, email_address').in('id', emails)
export type GroupedEmails = QueryData<ReturnType<typeof groupedEmailsQuery>>

// export const reportsQuery = await supabase.from('reports').select()

// export type Reports = QueryData<typeof reportsQuery>

// export const reportsWithEmailsDepartmentsQuery = supabase.from('reports').select(`
//   *,
//   emails (
//     id,
//     email_address
//   ),
//   departments (
//     id,
//     name
//   )
// `)

//

// export const reportsWithDetailsQuery = supabase
//   .from('reports')
//   .select(`
//     *,
//     report_email (
//       id,
//       emails:emails (
//         id,
//         email_address,
//         date_added
//       )
//     ),
//     report_department (
//       id,
//       departments:departments (
//         id,
//         name,
//         date_added
//       )
//     )
//   `);

// Define the ReportRow type for transformed data
export interface ReportRow {
  id: string;
  subject: string;
  date_added: string;
  emails: {
    id: string;
    email_address: string;
    date_added: string;
  }[];
  departments: {
    id: string;
    name: string;
    date_added: string;
  }[];
}

// Fetch reports with their associated emails and departments
// export const reportsWithDetailsQuery = async (): Promise<ReportRow[]> => {
export const reportsWithDetailsQuery = supabase
    .from('reports')
    .select(`
      *,
      report_email (
        id,
        emails:emails (
          id,
          email_address,
          date_added
        )
      ),
      report_department (
        id,
        departments:departments (
          id,
          name,
          date_added
        )
      )
    `);

//   if (error) {
//     console.error('Error fetching reports:', error);
//     throw error;
//   }

//   // Transform the data to match the ReportRow type
//   return (
//     data?.map(report => ({
//       id: report.id,
//       subject: report.subject || '', // Ensure subject is a string
//       date_added: report.date_added,
//       emails: report.report_email
//         ?.map(re => re.emails)
//         .filter(email => email !== null) || [], // Filter out null values
//       departments: report.report_department
//         ?.map(rd => rd.departments)
//         .filter(dept => dept !== null) || [], // Filter out null values
//     })) || []
//   );
// };

export type ReportsWithDetails = QueryData<typeof reportsWithDetailsQuery>

// export const reportWithDetailsQuery = (id: string) => supabase.from('reports')
// .select(`
//   *,
//     report_email (email_address),
//     report_department (name)
// `).eq('id', id).single()

// export const reportWithDetailsQuery = (id: string) =>
//   supabase
//     .from('reports')
//     .select(`
//       *,
//       report_email (
//         id,
//         email:emails (
//           id,
//           email_address,
//           date_added
//         )
//       ),
//       report_department (
//         id,
//         department:departments (
//           id,
//           name,
//           date_added
//         )
//       )
//     `)
//     .eq('id', id)
//     .single();

// export type ReportWithDetails = QueryData<ReturnType<typeof reportWithDetailsQuery>>

export const emailsWithReportsProfilesQuery = supabase.from('emails').select(`
  *,
  reports (
    id,
    subject
  )
`).order('id')

export type EmailsWithReportsProfiles = QueryData<typeof emailsWithReportsProfilesQuery>

export const departmentsWithReportsProfilesQuery = supabase.from('departments').select(`
  *,
  reports (
    id,
    subject
  )
`).order('id')

export type DepartmentsWithReportsProfiles = QueryData<typeof departmentsWithReportsProfilesQuery>

export const emailQuery = (id: number) => supabase.from('emails').select(`
  *,
  reports (
    id,
    subject
  ),
  profiles (
    id,
    full_name
  )
`).eq('id', id).single()

export type Email = QueryData<ReturnType<typeof emailQuery>>

export const departmentQuery = (id: number) => supabase.from('departments').select(`
  *,
  reports (
    id,
    subject
  ),
  profiles (
    id,
    full_name
  )
`).eq('id', id).single()

export type Department = QueryData<ReturnType<typeof departmentQuery>>
