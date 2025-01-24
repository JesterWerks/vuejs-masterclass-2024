<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { usePageStore } from '@/stores/page';
import { columns } from '@/utils/tableColumns/reportsColumns';


usePageStore().pageData.title = 'Reports'
const reportsLoader = useReportsStore()
const { reportsWithDetails } = storeToRefs(reportsLoader)
const { getReports } = reportsLoader


await getReports()

// console.log(`reports in index: ${JSON.stringify(reportsWithDetails.value)}`)

</script>

<template>
  <DataTable v-if="reportsWithDetails" :columns="columns" :data="reportsWithDetails" />
</template>

<style scoped></style>
