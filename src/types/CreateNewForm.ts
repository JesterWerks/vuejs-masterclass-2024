export interface CreateNewTask {
  name: string
  description: string
  project_id: number
  profile_id: string
}

export interface CreateNewReport {
  cc_email?: string | null
  columnsort?: number | null
  completion_filter?: number | null
  course_type_only?: number | null
  date_added?: string
  date_edited?: string
  departments_display?: string | null
  emails_display?: string | null
  id?: never
  login_filter?: number | null
  ple_only?: number | null
  profile_id: string
  remove_button?: number | null
  report_id?: number | null
  rowsort?: number | null
  subject?: string | null
  summary_only?: number | null
}

export interface CreateNewDepartment {
  name: string
  reports_id: number[]
  profile_id: string
}

export interface CreateNewEmail {
  email_address: string
  reports_id: number[]
  profile_id: string
}
