<script setup lang="ts">
import type { CreateNewDepartment } from '@/types/CreateNewForm'
import { createNewDepartmentQuery, profilesQuery, reportsQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

const getDepartmentsOptions = async () => {
  const { data: allDepartments } = await reportsQuery

  if (!allDepartments) return

  allDepartments.forEach((report) => {
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
  await Promise.all([getDepartmentsOptions(), getProfilesOptions()])
}

getOptions()

const { profile } = storeToRefs(useAuthStore())

const createDepartment = async (formData: CreateNewDepartment) => {
  const department = {
    ...formData,
    report_id: [profile.value!.id],
  }

  const { error } = await createNewDepartmentQuery(department)

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
        <SheetTitle>Create new department</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="createDepartment"
        submit-label="Create department"
        :config="{
          validationVisibility: 'submit',
        }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          placeholder="My new department"
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
          name="project_id"
          id="project_id"
          label="Department"
          placeholder="Select a project"
          :options="selectOptions.reports"
          validation="required"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Department description"
          validation="length:0,500"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>
