import type { ColumnDef } from "@tanstack/vue-table";
import { type ReportsWithEmailsDepartments } from "../supaQueries";
import { RouterLink } from "vue-router";
import Button from "@/components/ui/button/Button.vue";
// import Avatar from "@/components/ui/avatar/Avatar.vue";
// import AvatarImage from "@/components/ui/avatar/AvatarImage.vue";
// import type { GroupedCollabs } from "@/types/groupedCollabs";
// import AvatarFallback from "@/components/ui/avatar/AvatarFallback.vue";



export const columns: ColumnDef<ReportsWithEmailsDepartments[0]>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'text-left' }, 'Id'),
    cell: ({ row }) => {
      const id: string = row.getValue('id')
      return h('div', { class: 'text-left font-small' }, id)
    },
  },
  {
    accessorKey: 'subject',
    header: () => h('div', { class: 'text-left hover:bg-muted' }, 'Subject Line'),
    cell: ({ row }) => {
      const subject = row.getValue('subject')
      return h(RouterLink, { to: `/reports/${subject}`, class: 'text-left font-small' }, row.getValue('subject'))
    }
  },
  {
    accessorKey: 'departments',
    header: () => h('div', { class: 'text-left' }, 'Departments'),
    cell: ({ row }) => {
      const departments: { id: number, name: string }[] = row.getValue('departments');
      const departmentLinks = departments.map(department =>
        h(
          Button,
          {
            variant: 'outline',
            size: 'sm',
            class: 'm-0.5',
            key: department.id,
          },
          () =>
            h(
              RouterLink,
              {
                to: `/departments/${department.id}`,
                class: 'department-link flex items-center justify-center w-full h-full',
              },
              department.name // The department name as the button's content
            )
        )
      );

      // Wrap links in a container div
      return h('div', { class: 'text-left font-small' }, departmentLinks);
    }
  },
  {
    accessorKey: 'emails',
    header: () => h('div', { class: 'text-left' }, 'Recipients'),
    cell: ({ row }) => {
      const emails: { id: number, email: string }[] = row.getValue('emails');
      // console.log('emails:', emails)
      const emailLinks = emails.map(email =>
        h(
          Button,
          {
            variant: 'outline',
            size: 'sm',
            class: 'm-0.5',
            key: email.id,
          },
          () =>
            h(
              RouterLink,
              {
                to: `/emails/${email.id}`,
                class: 'email-link flex items-center justify-center w-full h-full',
              },
              email.email // The email email as the button's content
            )
        )
    );

      // Wrap links in a container div
      return h('div', { class: 'text-left font-small' }, emailLinks);
    }
  },
  {
    accessorKey: 'profile_id',
    header: () => h('div', { class: 'text-left' }, 'Set Up By'),
    cell: ({ row }) => {
      // console.log('row:', row)
      const profileId: string = row.getValue('profile_id')
      return h('div', { class: 'text-left font-small' }, profileId)
    }
  },
]
