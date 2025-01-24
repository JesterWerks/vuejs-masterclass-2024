import { emailsQuery } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"
import type { Emails } from "@/utils/supaQueries"
import { useErrorStore } from "@/stores/error"

export const useEmailsStore = defineStore('emails-store', () => {
  const emailsWithReportsProfiles = ref<Emails | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadEmailsWithReports = useMemoize((key: string) => emailsQuery)

  const validateCache = () => {
    if (emailsWithReportsProfiles.value?.length) {
      emailsQuery.then(({ data, error }) => {
        if (JSON.stringify(emailsWithReportsProfiles.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
          return
        } else {
          console.log('Something has changed!')
          loadEmailsWithReports.delete('emailsWithReportsProfiles')
          if (!error && data) emailsWithReportsProfiles.value = data
        }
      })
    }
  }

  const getReports = async () => {
    const { data, error, status } = await loadEmailsWithReports('projects')

    if (error) useErrorStore().setError({ error, customCode: status })

    emailsWithReportsProfiles.value = data

    validateCache()
  }

  return { emailsWithReportsProfiles, getReports }
})
