<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { ref } from 'vue'
import { usePageStore } from '@/stores/page';
import { departmentsWithReportsProfilesQuery } from '@/utils/supaQueries';
import type { DepartmentsWithReportsProfiles } from '@/utils/supaQueries';
import { columns } from '@/utils/tableColumns/departmentColumns';

usePageStore().pageData.title = 'Departments'

const departments = ref<DepartmentsWithReportsProfiles | null>(null)

const getDepartments = async () => {
  const { data, error } = await departmentsWithReportsProfilesQuery

  if (error) console.log('error', error)

  departments.value = data
  console.log('departments', departments.value)
}

await getDepartments()

</script>

<template>
  <DataTable v-if="departments" :columns="columns" :data="departments" />
</template>

<style scoped></style>
