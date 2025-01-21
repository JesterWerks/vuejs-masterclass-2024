import type { ColumnDef } from "@tanstack/vue-table"
import type { DepartmentsWithReportsProfiles } from "../supaQueries"
import { formatDate } from '../helpers/dateFormatter';
import { RouterLink } from "vue-router";

const departmentId = ref(0)

export const columns: ColumnDef<DepartmentsWithReportsProfiles[0]>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-left hover:bg-muted' }, 'Id'),
    cell: ({ row }) => {
      const departmentId: number = row.getValue('id')
      return h('div', { class: 'text-left font-small' }, departmentId)
    }
  },
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Department Name'),
    cell: ({ row }) => {
      const departmentName: string = row.getValue('name')
      departmentId.value = row.getValue('id')
      return h(RouterLink, { to: `/departments/${departmentId.value}`, class: 'text-left font-small' }, departmentName)
    }
  },
  {
    accessorKey: 'date_added',
    header: () => h('div', { class: 'text-left' }, 'Date Added'),
    cell: ({ row }) => {
      const departmentDateAdded: string = row.getValue('date_added')
      return h('div', { class: 'text-left font-small' }, formatDate(departmentDateAdded))
    }
  },
  {
    accessorKey: 'date_edited',
    header: () => h('div', { class: 'text-left' }, 'Date Edited'),
    cell: ({ row }) => {
      const departmentDateEdited: string = row.getValue('date_edited')
      return h('div', { class: 'text-left font-small' }, formatDate(departmentDateEdited))
    }
  },

]
