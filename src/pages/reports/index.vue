<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { usePageStore } from '@/stores/page';
import { columns } from '@/utils/tableColumns/reportsColumns';


usePageStore().pageData.title = 'Reports'
const reportsLoader = useReportsStore()
const { reportsWithDetailsQuery } = storeToRefs(reportsLoader)
const { getReports } = reportsLoader


await getReports()

console.log(`Reports: ${await getReports()}`)

</script>

<template>
  <DataTable v-if="reportsWithDetailsQuery" :columns="columns" :data="reportsWithDetailsQuery" />
</template>

<style scoped></style>
