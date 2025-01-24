<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { reportQuery } from '@/utils/supaQueries';
import type { Report } from '@/utils/supaQueries'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/stores/page';



const fields: string[] = [
  'rowsort',
  'cc_email',
  'columnsort',
  'login_filter',
  'completion_filter',
  'remove_button',
  'course_type_only',
  'ple_only',
  'summary_only'
];

const { subject } = useRoute('/reports/[subject]').params;

const report = ref<Report | null>(null)

watch(
  () => report.value?.subject,
  () => {
    usePageStore().pageData.title = `Report: ${report.value?.subject || ''}`
  }
)

const getReport = async () => {
  const { data, error } = await reportQuery(subject)
  if (error) console.log('error', error)

  report.value = data
}

await getReport()
// const departments: (string[] | null) = report.value?.departments ? report.value.departments : null
// const emails: (string[] | null) = report.value?.emails_display ? report.value.emails_display.split(';') : null

// const departments: (reportQuery['departments'] | null) = report.value?.departments ? report.value.departments : null
// console.log(`departments: ${departments}`)
// const emails: (reportQuery['emails'] | null) = report.value?.emails ? report.value.emails : null
// console.log(`emails: ${emails}`)


const newDateEdited = report.value?.date_edited ? new Date(report.value.date_edited).toLocaleString() : null
</script>

<template>
  <Table v-if="report">
    <TableRow>
      <TableHead> Id </TableHead>
      <TableCell>{{ report?.id }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Departments </TableHead>
      <TableCell v-if="report.departments">
        <RouterLink v-for="(dept, index) in report.departments" :key="index" :to="`/departments/${dept}`">{{ `${dept}, ` }}</RouterLink>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Recipients </TableHead>
      <TableCell v-if="report.emails">
        <RouterLink v-for="(email, index) in report.emails" :key="index" :to="`/departments/${email}`">{{ `${email}, ` }}</RouterLink>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Subject </TableHead>
      <TableCell> {{ subject }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Last Edited Date </TableHead>
      <TableCell>{{ newDateEdited }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> User Profile </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar class="-mr-4 border border-primary hover:scale-110 transition-transform">
            <RouterLink class="w-full h-full flex items-center justify-center" :to="`/users/${report?.profile_id}`">
              <AvatarImage src="" alt="" />
              <AvatarFallback> </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
  </Table>

  <section v-if="report" class="mt-10 flex flex-col md:flex-row gap-5 justify-between grow">
    <div class="flex-1">
      <h2>Report Settings</h2>
      <div class="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> Name </TableHead>
              <TableHead> Value </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="field in fields" :key="field">
              <TableCell> {{ `${field}` }} </TableCell>
              <TableCell> {{ `${(report as any)[field]}` }} </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <div class="flex-1">
      <h2>Documents</h2>
      <div class="table-container">
        <p class="text-muted-foreground text-sm font-semibold px-4 py-3">
          This project doesn't have documents yet...
        </p>
      </div>
    </div>
  </section>
</template>

<style>
th {
  @apply w-[100px];
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>
