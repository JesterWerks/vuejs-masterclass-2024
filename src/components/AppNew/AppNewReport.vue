<script setup lang="ts">
import type { CreateNewReport } from '@/types/CreateNewForm'
import { createNewReportQuery, profilesQuery, reportsQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

const getReportsOptions = async () => {
  const { data: allReports } = await reportsQuery

  if (!allReports) return

  allReports.forEach((report) => {
    selectOptions.value.reports.push({
      label: report.subject ?? '',
      value: report.id,
    })
  })
}

const getProfilesOptions = async () => {
  const { data: allProfiles } = await profilesQuery

  if (!allProfiles) return

  allProfiles.forEach((profile) => {
    selectOptions.value.profiles.push({
      label: profile.full_name,
      value: profile.id,
    })
  })
}

const getOptions = async () => {
  await Promise.all([getReportsOptions(), getProfilesOptions()])
}

getOptions()

const { profile } = storeToRefs(useAuthStore())

const createReport = async (formData: CreateNewReport) => {
  const task = {
    ...formData,
    collaborators: [profile.value!.id],
  }

  const { error } = await createNewReportQuery(task)

  if (error) {
    console.log(error)
  }

  sheetOpen.value = false
}

type SelectOption = { label: string; value: string | number }

const selectOptions = ref({
  reports: [] as SelectOption[],
  profiles: [] as SelectOption[],
})
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create new task</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="createReport"
        submit-label="Create task"
        :config="{
          validationVisibility: 'submit',
        }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          placeholder="My new task"
          validation="required|length:1,255"
        />
        <FormKit
          type="select"
          name="profile_id"
          id="profile_id"
          label="User"
          placeholder="Select a user"
          :options="selectOptions.profiles"
          validation="required"
        />
        <FormKit
          type="select"
          name="report_id"
          id="report_id"
          label="Report"
          placeholder="Select a report"
          :options="selectOptions.reports"
          validation="required"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Report description"
          validation="length:0,500"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>
