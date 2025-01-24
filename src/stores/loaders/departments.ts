import { departmentsQuery } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"
import type { Departments } from "@/utils/supaQueries"
import { useErrorStore } from "@/stores/error"

export const useDepartmentsStore = defineStore('departments-store', () => {
  const departmentsWithReports = ref<Departments | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadDeparmentsWithReports = useMemoize((key: string) => departmentsQuery)

  const validateCache = () => {
    if (departmentsWithReports.value?.length) {
      departmentsQuery.then(({ data, error }) => {
        if (JSON.stringify(departmentsWithReports.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
          return
        } else {
          console.log('Something has changed!')
          loadDeparmentsWithReports.delete('reportsWithEmailsDepartments')
          if (!error && data) departmentsWithReports.value = data
        }
      })
    }
  }

  const getDeparments = async () => {
    const { data, error, status } = await departmentsQuery

    if (error) useErrorStore().setError({ error, customCode: status })

    departmentsWithReports.value = data

    validateCache()
  }

  return { departmentsWithReports, getDeparments }
})
