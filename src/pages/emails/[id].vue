<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang='ts'>
import { emailQuery } from '@/utils/supaQueries';
import type { Email } from '@/utils/supaQueries'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/stores/page';

const { id } = useRoute('/emails/[id]').params;
const email = ref<Email | null>(null)

watch(
  () => email.value?.email,
  () => {
    usePageStore().pageData.title = `Email: ${email.value?.email || ''}`
  }
)

const getEmail = async () => {
  const { data, error } = await emailQuery(parseInt(id))
  if (error) console.log('error', error)

  console.log('email data', data)
  email.value = data
}

await getEmail()

</script>

<template>
  <Table v-if="email">
    <TableRow>
      <TableHead> Id </TableHead>
      <TableCell>{{ email.id }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Email </TableHead>
      <TableCell> {{ email.email }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Reports </TableHead>
      <TableCell v-if="email.reports">
        <RouterLink v-for="emailReport in email.reports" :key="emailReport!" :to="`/reports/${emailReport}`">{{
          `${emailReport}`
        }}
        </RouterLink>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Date Added </TableHead>
      <TableCell>{{ email.date_added }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Date Edited </TableHead>
      <TableCell>{{ email.date_edited }}</TableCell>
    </TableRow>
    <TableRow>
      <TableHead> User Profile </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar class="-mr-4 border border-primary hover:scale-110 transition-transform"
            :class="email.profile_id ? 'cursor-pointer' : 'cursor-not-allowed'">
            <RouterLink class="w-full h-full flex items-center justify-center" :to="`/users/${email.profile_id}`">
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
