import { reportsWithEmailsDepartmentsQuery, type ReportsWithEmailsDepartments } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"
import { useErrorStore } from "@/stores/error"

export const useReportsStore = defineStore('reports-store', () => {
  const reportsWithEmailsDepartments = ref<ReportsWithEmailsDepartments | null>(null)
  const loadReportsWithEmailsDepartments = useMemoize((key: string) => reportsWithEmailsDepartmentsQuery)

  const validateCache = () => {
    if (reportsWithEmailsDepartments.value?.length) {
      reportsWithEmailsDepartmentsQuery.then(({ data, error }) => {
        if (JSON.stringify(reportsWithEmailsDepartments.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
          return
        } else {
          console.log('Somehting has changed!')
          loadReportsWithEmailsDepartments.delete('reportsWithEmailsDepartments')
          if (!error && data) reportsWithEmailsDepartments.value = data
        }
      })
    }
  }

  const getReports = async () => {
    const { data, error, status } = await loadReportsWithEmailsDepartments('projects')

    if (error) useErrorStore().setError({ error, customCode: status })

    reportsWithEmailsDepartments.value = data

    validateCache()
  }

  return { reportsWithEmailsDepartments, getReports }
})
