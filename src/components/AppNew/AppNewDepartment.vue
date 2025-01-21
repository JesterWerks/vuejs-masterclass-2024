<script setup lang="ts">
import type { CreateNewDepartment } from '@/types/CreateNewForm'
import { createNewDepartmentQuery, profilesQuery, reportsWithDetailsQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

const getDepartmentsOptions = async () => {
  const { data: allDepartments } = await reportsWithDetailsQuery

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

// const { profile } = storeToRefs(useAuthStore())
const { reportsWithEmailsDepartments } = storeToRefs(useReportsStore())

const createDepartment = async (formData: CreateNewDepartment) => {
  const department = {
    ...formData,
    report_id: [reportsWithEmailsDepartments.value!.id],
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
          label="Department Name"
          placeholder="My new department"
          validation="required|length:3,120"
        />
        <FormKit
          type="select"
          multiple="true"
          name="profile_id"
          id="profile_id"
          label="User"
          placeholder="Select a user"
          :options="selectOptions.profiles"
          validation="required"
        />
        <FormKit
          type="select"
          multiple="true"
          name="report_id"
          id="report_id"
          label="Report(s)"
          placeholder="Select report(s)"
          :options="selectOptions.reports"
          validation="required"
        />
        <!-- <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Department description"
          validation="length:0,500"
        /> -->
      </FormKit>
    </SheetContent>
  </Sheet>
</template>
