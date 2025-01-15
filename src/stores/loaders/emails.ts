import { emailsWithReportsProfilesQuery } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"
import type { EmailsWithReportsProfiles } from "@/utils/supaQueries"
import { useErrorStore } from "@/stores/error"

export const useEmailsStore = defineStore('emails-store', () => {
  const emailsWithReportsProfiles = ref<EmailsWithReportsProfiles | null>(null)
  const loadEmailsWithReportsProfiles = useMemoize((key: string) => emailsWithReportsProfilesQuery)

  const validateCache = () => {
    if (emailsWithReportsProfiles.value?.length) {
      emailsWithReportsProfilesQuery.then(({ data, error }) => {
        if (JSON.stringify(emailsWithReportsProfiles.value) === JSON.stringify(data)) {
          console.log('Cached and fresh data matched!')
          return
        } else {
          console.log('Something has changed!')
          loadEmailsWithReportsProfiles.delete('emailsWithReportsProfiles')
          if (!error && data) emailsWithReportsProfiles.value = data
        }
      })
    }
  }

  const getReports = async () => {
    const { data, error, status } = await loadEmailsWithReportsProfiles('projects')

    if (error) useErrorStore().setError({ error, customCode: status })

    emailsWithReportsProfiles.value = data

    validateCache()
  }

  return { emailsWithReportsProfiles, getReports }
})
