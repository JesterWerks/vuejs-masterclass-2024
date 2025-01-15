import { supabase } from '@/lib/supabaseClient'
import type { CreateNewTask } from '@/types/CreateNewForm'
import type { CreateNewReport } from '@/types/CreateNewForm'
import type { CreateNewEmail } from '@/types/CreateNewForm'
import type { CreateNewDepartment } from '@/types/CreateNewForm'
import type { QueryData } from '@supabase/supabase-js'

export const tasksWithProjectsQuery = supabase.from('tasks').select(`
  *,
  projects (
    id,
    name,
    slug
  )
  `)
export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>

export const projectsQuery = supabase.from('projects').select()
export type Projects = QueryData<typeof projectsQuery>

export const projectQuery = (slug: string) =>
  supabase
    .from('projects')
    .select(
      `
  *,
  tasks (
    id,
    name,
    status,
    due_date
  )
`,
    )
    .eq('slug', slug)
    .single()

export type Project = QueryData<ReturnType<typeof projectQuery>>

export const updateProjectQuery = (updatedProject = {}, id: number) => {
  return supabase.from('projects').update(updatedProject).eq('id', id)
}

export const taskQuery = (id: string) => {
  return supabase
    .from('tasks')
    .select(
      `
    *,
    projects (
      id,
      name,
      slug
    )
    `,
    )
    .eq('id', id)
    .single()
}

export type Task = QueryData<ReturnType<typeof taskQuery>>

export const updateTaskQuery = (updatedTask = {}, id: number) => {
  return supabase.from('tasks').update(updatedTask).eq('id', id)
}

export const deleteTaskQuery = (id: number) => {
  return supabase.from('tasks').delete().eq('id', id)
}

export const profileQuery = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select().eq(column, value).single()
}

export const profilesQuery = supabase.from('profiles').select(`id, full_name`)

export const groupedProfilesQuery = (userIds: string[]) =>
  supabase.from('profiles').select('username, avatar_url, id, full_name').in('id', userIds)
export type Collabs = QueryData<ReturnType<typeof groupedProfilesQuery>>

export const createNewTaskQuery = (newTask: CreateNewTask) => {
  return supabase.from('tasks').insert(newTask)
}

export const createNewReportQuery = (newReport: CreateNewReport) => {
  return supabase.from('reports').insert(newReport)
}

export const createNewDepartmentQuery = (newDepartment: CreateNewDepartment) => {
  return supabase.from('departments').insert(newDepartment)
}

export const createNewEmailQuery = (newEmail: CreateNewEmail) => {
  return supabase.from('emails').insert(newEmail)
}

export const groupedDepartmentsQuery = (departments: number[]) =>
  supabase.from('departments').select('id, name').in('id', departments)
export type GroupedDepartments = QueryData<ReturnType<typeof groupedDepartmentsQuery>>

export const groupedEmailsQuery = (emails: string[]) =>
  supabase.from('emails').select('id, email').in('id', emails)
export type GroupedEmails = QueryData<ReturnType<typeof groupedEmailsQuery>>

export const reportsQuery = await supabase.from('reports').select()

export type Reports = QueryData<typeof reportsQuery>

export const reportsWithEmailsDepartmentsQuery = supabase.from('reports').select(`
  *,
  emails (
    id,
    email
  ),
  departments (
    id,
    name
  )
`)

export type ReportsWithEmailsDepartments = QueryData<typeof reportsWithEmailsDepartmentsQuery>

export const reportQuery = (subject: string) => supabase.from('reports').select(`
  *,
  emails (
    id,
    email
  ),
  departments (
    id,
    name
  )
`).eq('subject', subject).single()

export type Report = QueryData<ReturnType<typeof reportQuery>>

export const emailsWithReportsProfilesQuery = supabase.from('emails').select(`
  *,
  reports (
    id,
    subject,
    profile_id
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
