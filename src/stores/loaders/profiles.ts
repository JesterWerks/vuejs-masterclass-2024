// import { fetchReportsWithDetails } from "@/utils/supaQueries"
// import { useMemoize } from "@vueuse/core"
// import type { ProfilesWithReports } from "@/utils/supaQueries"
// import { useErrorStore } from "@/stores/error"

// export const useProfilesStore = defineStore('profiles-store', () => {

// // export const useDepartmentsStore = defineStore('profiles-store', () => {
//   const profilesWithReports = ref<ProfilesWithReports | null>(null)

// //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const loadProfilesWithReports = useMemoize((key: string) => fetchReportsWithDetails)

//   const validateCache = () => {
//     if (profilesWithReports.value?.length) {
//   //     fetchReportsWithDetails.then(({ data, error }) => {
//   //       if (JSON.stringify(profilesWithReports.value) === JSON.stringify(data)) {
//   //         console.log('Cached and fresh data matched!')
//   //         return
//   //       } else {
//   //         console.log('Something has changed!')
//   //         loadProfilesWithReports.delete('profilesWithReports')
//   //         if (!error && data) profilesWithReports.value = data
//   //       }
//   //     })
//     }
//   }

// //   const getProfiles = async () => {
// //     const { data, error, status } = await fetchReportsWithDetails

// //     if (error) useErrorStore().setError({ error, customCode: status })

// //     profilesWithReports.value = data

// //     validateCache()
// //   }

// //   return { profilesWithReports, getProfiles }
// // })
