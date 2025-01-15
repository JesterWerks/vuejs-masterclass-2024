<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { usePageStore } from '@/stores/page';
import { columns } from '@/utils/tableColumns/reportsColumns';


usePageStore().pageData.title = 'Reports'
const reportsLoader = useReportsStore()
const { reportsWithEmailsDepartments } = storeToRefs(reportsLoader)
const { getReports } = reportsLoader


await getReports()


</script>

<template>
  <DataTable v-if="reportsWithEmailsDepartments" :columns="columns" :data="reportsWithEmailsDepartments" />
</template>

<style scoped></style>
