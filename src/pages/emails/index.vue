<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { ref } from 'vue'
import { usePageStore } from '@/stores/page';
import { emailsQuery } from '@/utils/supaQueries';
import type { Emails } from '@/utils/supaQueries';
import { columns } from '@/utils/tableColumns/emailColumns';

usePageStore().pageData.title = 'Emails'

const emails = ref<Emails | null>(null)

const getEmails = async () => {
  const { data, error } = await emailsQuery

  if (error) console.log('error', error)

  emails.value = data
  console.log('emails', emails.value)
}

await getEmails()


</script>

<template>
  <DataTable v-if="emails" :columns="columns" :data="emails" />
</template>

<style scoped></style>
