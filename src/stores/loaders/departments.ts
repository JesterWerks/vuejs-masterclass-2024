import { departmentsWithReportsProfilesQuery } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"
import type { DepartmentsWithReportsProfiles } from "@/utils/supaQueries"
import { useErrorStore } from "@/stores/error"

export const useDepartmentsStore = defineStore('departments-store', () => {
  const departmentsWithReportsProfiles = ref<DepartmentsWithReportsProfiles | null>(null)
  const loadDeparmentsWithReportsProfiles = useMemoize((key: string) => departmentsWithReportsProfilesQuery)

  const validateCache = () => {
    if (departmentsWithReportsProfiles.value?.length) {
      departmentsWithReportsProfilesQuery.then(({ data, error }) => {
        if (JSON.stringify(departmentsWithReportsProfiles.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
          return
        } else {
          console.log('Something has changed!')
          loadDeparmentsWithReportsProfiles.delete('reportsWithEmailsDepartments')
          if (!error && data) departmentsWithReportsProfiles.value = data
        }
      })
    }
  }

  const getDeparments = async () => {
    const { data, error, status } = await departmentsWithReportsProfilesQuery

    if (error) useErrorStore().setError({ error, customCode: status })

    departmentsWithReportsProfiles.value = data

    validateCache()
  }

  return { departmentsWithReportsProfiles, getDeparments }
})
