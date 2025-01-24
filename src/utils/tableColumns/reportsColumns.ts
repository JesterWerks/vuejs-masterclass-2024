import type { ColumnDef } from "@tanstack/vue-table";
import { type Reports } from "../supaQueries";
import { RouterLink } from "vue-router";

export const columns: ColumnDef<Reports[0]>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-left' }, 'Id'),
    cell: ({ row }) => {
      const id: string = row.getValue('id');
      return h('div', { class: 'text-left font-small' }, id);
    },
  },
  {
    accessorKey: 'subject',
    header: () => h('div', { class: 'text-left hover:bg-muted' }, 'Subject Line'),
    cell: ({ row }) => {
      const subject = row.getValue('subject');
      return h(RouterLink, { to: `/reports/${subject}`, class: 'text-left font-small' }, { default: () => subject });
    },
  },
  {
    accessorKey: 'departments',
    header: () => h('div', { class: 'text-left' }, 'Departments'),
    cell: ({ row }) => {
      const departments: { id: number, name: string }[] = row.getValue('departments');
      const departmentLinks = departments.map(department =>
        h(
          RouterLink,
          {
            to: `/departments/${department.id}`,
            class: 'department-link text-blue-500 underline m-1',
            key: department.id,
          },
          department.name
        )
      );

      return h('div', { class: 'text-left font-small flex flex-wrap' }, departmentLinks);
    },
  },
  {
    accessorKey: 'emails',
    header: () => h('div', { class: 'text-left' }, 'Recipient Emails'),
    cell: ({ row }) => {
      const emails: { id: number, email_address: string }[] = row.getValue('emails');
      const departmentLinks = emails.map(department =>
        h(
          RouterLink,
          {
            to: `/emails/${department.id}`,
            class: 'department-link text-blue-500 underline m-1',
            key: department.id,
          },
          department.email_address
        )
      );

      return h('div', { class: 'text-left font-small flex flex-wrap' }, departmentLinks);
    },
  },
];
