import type { ColumnDef } from "@tanstack/vue-table"
import type { EmailsWithReportsProfiles } from "../supaQueries"
import { formatDate } from "../helpers/dateFormatter"
import { RouterLink } from "vue-router"

export const columns: ColumnDef<EmailsWithReportsProfiles[0]>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-left hover:bg-muted' }, 'Id'),
    cell: ({ row }) => {
      const emailId: number = row.getValue('id')
      return h('div', { class: 'text-left font-small' }, emailId)
    }
  },
  {
    accessorKey: 'email',
    header: () => h('div', { class: 'text-left hover:bg-muted' }, 'Email Address'),
    cell: ({ row }) => {
      const emailId: number = row.getValue('id')
      const emailAddress: string = row.getValue('email')
      return h(RouterLink, { to: `/emails/${emailId}`, class: 'text-left font-small' }, emailAddress)
    }
  },
  {
    accessorKey: 'date_added',
    header: () => h('div', { class: 'text-left' }, 'Date Added'),
    cell: ({ row }) => {
      const emailDateAdded: string = row.getValue('date_added')
      return h('div', { class: 'text-left font-small' }, formatDate(emailDateAdded))
    }
  },
  {
    accessorKey: 'date_edited',
    header: () => h('div', { class: 'text-left' }, 'Date Edited'),
    cell: ({ row }) => {
      const emailDateEdited: string = row.getValue('date_edited')
      return h('div', { class: 'text-left font-small' }, formatDate(emailDateEdited))
    }
  },
  {
    accessorKey: 'profile_id',
    header: () => h('div', { class: 'text-left' }, 'Set Up By'),
    cell: ({ row }) => {
      const profileId: string = row.getValue('profile_id')
      return h('div', { class: 'text-left font-small' }, profileId)
    }
  },
]
