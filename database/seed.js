/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-env node */
import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

const numEntriesPerTable = 4

const departmentNames = faker.helpers.uniqueArray(faker.commerce.department, 30)
const emailAddresses = faker.helpers.uniqueArray(faker.internet.email, 30)

// console.log('departments', departments)
// console.log('emailAddresses', emailAddresses)

const testingUserEmail = process.env.TESTING_USER_EMAIL
if (!testingUserEmail) {
  console.error('Have you forgot to add TESTING_USER_EMAIL to your .env file?')
  process.exit()
}

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`,
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

let profileId = ''

const PrimaryTestUserExists = async () => {
  logStep('Checking if primary test user exists...')
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', 'testaccount1')
    .single()

  if (error) {
    console.log('Primary test user not found. Will create one.')
    return false
  }

  logStep(`Primary test user is found. data.id = ${data.id}`)
  profileId = data.id
  console.log(`profileId: ${profileId}`)

  return data.id
}

const createPrimaryTestUser = async () => {
  logStep('Creating primary test user...')
  const firstName = 'Test'
  const lastName = 'Account'
  const userName = 'testaccount1'
  const email_address = testingUserEmail
  const { data, error } = await supabase.auth.signUp({
    email: email_address,
    password: 'password',
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: firstName + ' ' + lastName,
        username: userName,
      },
    },
  })
  profileId = data.user.id


  if (error) {
    logErrorAndExit('Users', error)
  }

  if (data) {
    const userId = data.user.id
    await supabase.from('profiles').insert({
      id: userId,
      full_name: firstName + ' ' + lastName,
      username: userName,
      bio: 'The main testing account',
      avatar_url: `https://i.pravatar.cc/150?u=${data.user.id}`,
    })

    logStep('Primary test user created successfully.')
    return userId
  }
}

const seedEmails = async () => {
  const emailsRecords = []

  for (let i = 0; i < emailAddresses.length; i++) {
    // console.log(`EMAILADDRESS in seedEmails: ${emailAddresses[i]}`)
    emailsRecords.push({
      email_address: emailAddresses[i],
    })
  }
  // console.log(`emailsRecords: ${JSON.stringify(emailsRecords)}`)

  const res = await supabase.from('emails').upsert(emailsRecords).select('id, email_address')
  return res
}

const seedDepartments = async () => {
  const departmentsRecords = []

  for (let i = 0; i < departmentNames.length; i++) {
    // console.log(`DEPARTMENT in seedDepartments: ${departments[i]}`)
    departmentsRecords.push({
      name: departmentNames[i],
    })
  }
  const res = await supabase.from('departments').upsert(departmentsRecords).select('id, name')
  // console.log(`departmentsRecords: ${JSON.stringify(departmentsRecords)}`)
  return res
}

const seedReports = async (numEntries) => {
  // console.log(`numEntries: ${numEntries}`)
  // console.log(`emails: ${JSON.stringify(emails)}`)
  // console.log(`depts: ${JSON.stringify(depts)}`)

  const reports = []

  for (let i = 0; i < numEntries; i++) {
    const depts_display = faker.helpers.arrayElements(departmentNames, { min: 2, max: 4 })
    const email_display = faker.helpers.arrayElements(emailAddresses, { min: 1, max: 4 })

    let joinedDepartments = depts_display.join('%')
    let joinedEmails = email_display.join(';')

    reports.push({
      profile_id: profileId,
      departments_display: joinedDepartments,
      emails_display: joinedEmails,
      subject: joinedDepartments.replaceAll('%', '_'),
      rowsort: faker.helpers.arrayElement([0, 1]),
      cc_email: faker.internet.email(),
      columnsort: faker.helpers.arrayElement([0, 1]),
      login_filter: faker.helpers.arrayElement([0, 1]),
      completion_filter: faker.helpers.arrayElement([0, 1]),
      remove_button: faker.helpers.arrayElement([0, 1]),
      course_type_only: faker.helpers.arrayElement([0, 1]),
      ple_only: faker.helpers.arrayElement([0, 1]),
      summary_only: faker.helpers.arrayElement([0, 1]),
    })
  }

  console.log(`reports: ${JSON.stringify(reports[0])}`)

  console.log(
    `Seeded ${numEntriesPerTable} records with ${emailAddresses.length} emails and ${departmentNames.length} departments`,
  )

  return await supabase.from('reports').insert(reports).select('id')

}

// const seedDatabase = async (numEntriesPerTable) => {
  const seedDatabase = async (numEntriesPerTable) => {
  let userId

  const testUserId = await PrimaryTestUserExists()

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser()
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }
  console.log(`userId: ${userId}`)

  const seededEmails = await seedEmails()
  // console.log(`seededEmails: ${JSON.stringify(seededEmails.data)}`)

  const seededDepartments = await seedDepartments()
  // console.log(`seededDepartments: ${JSON.stringify(seededDepartments.data)}`)

  const seededReports = await seedReports(numEntriesPerTable)
  console.log(`seededReports: ${JSON.stringify(seededReports.data)}`)


}


await seedDatabase(numEntriesPerTable)
