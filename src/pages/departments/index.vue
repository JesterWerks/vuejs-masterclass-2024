<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { ref } from 'vue'
import { usePageStore } from '@/stores/page';
import { departmentsQuery } from '@/utils/supaQueries';
import type { Departments } from '@/utils/supaQueries';
import { columns } from '@/utils/tableColumns/departmentColumns';

usePageStore().pageData.title = 'Departments'

const departments = ref<Departments | null>(null)

const getDepartments = async () => {
  const { data, error } = await departmentsQuery

  if (error) console.log('error', error)

  departments.value = data
}

await getDepartments()

</script>

<template>
  <DataTable v-if="departments" :columns="columns" :data="departments" />
</template>

<style scoped></style>
