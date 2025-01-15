<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { departmentQuery } from '@/utils/supaQueries';
import type { Department } from '@/utils/supaQueries'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/stores/page';
// import type { Tables } from 'database/types';

const { id } = useRoute('/departments/[id]').params;

const department = ref<Department | null>(null)
// const profile = ref<Tables<'profiles'> | null>(null)
console.log('id: ', id)

watch(
  () => department.value?.name,
  () => {
    usePageStore().pageData.title = `Department: ${department.value?.name || ''}`
  }
)

const getDepartment = async () => {
  const { data, error } = await departmentQuery(parseInt(id))
  console.log('dept data', data)

  if (error) console.log('error', error)


  department.value = data
}

await getDepartment()

</script>

<template>
  <Table v-if="department">
    <TableRow>
      <TableHead> Id </TableHead>
      <TableCell>{{ department.id }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Name </TableHead>
      <TableCell> {{ department.name }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Reports </TableHead>
      <TableCell v-if="department.reports">
        <RouterLink v-for="report in department.reports" :key="report!" :to="`/reports/${report}`">{{ `${report}`
          }}
        </RouterLink>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Date Added </TableHead>
      <TableCell>{{ department.date_added }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Date Edited </TableHead>
      <TableCell>{{ department.date_edited }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> User Profile </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar class="-mr-4 border border-primary hover:scale-110 transition-transform"
            :class="department.profile_id ? 'cursor-pointer' : 'cursor-not-allowed'">
            <RouterLink class="w-full h-full flex items-center justify-center" :to="`/users/${department.profile_id}`">
              <AvatarImage src="" alt="" />
              <AvatarFallback> </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
  </Table>

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
