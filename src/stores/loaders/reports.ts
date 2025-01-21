/* eslint-disable @typescript-eslint/no-unused-vars */
import { reportsWithDetailsQuery } from "@/utils/supaQueries"
import type { ReportsWithDetails } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"
import { useErrorStore } from "@/stores/error"

export const useReportsStore = defineStore('reports-store', () => {
  const reportsWithDetails = ref<ReportsWithDetails | null>(null)
  console.log('reportsWithDetails:', reportsWithDetails)
  const loadReportsWithDetails = useMemoize((key: string) => reportsWithDetailsQuery)

  const validateCache = () => {
    if (reportsWithDetails.value?.length) {
      reportsWithDetailsQuery.then(({ data, error }) => {
        if (JSON.stringify(reportsWithDetails.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
          return
        } else {
          console.log('Something has changed!')
          loadReportsWithDetails.delete('reportsWithDetails')
          if (!error && data) reportsWithDetails.value = data
        }
      })
    }
  }

  const getReports = async () => {
    const { data, error, status } = await loadReportsWithDetails('reports')

    if (error) useErrorStore().setError({ error, customCode: status })

    reportsWithDetails.value = data

    validateCache()
  }

  return { reportsWithDetails, getReports }
})
