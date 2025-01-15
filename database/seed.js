/* eslint-env node */
import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

const numEntriesPerTable = 10

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

let emailsRecords = []
let departmentsRecords = []
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

  logStep('Primary test user is found.')
  return data?.id
}

const createPrimaryTestUser = async () => {
  logStep('Creating primary test user...')
  const firstName = 'Test'
  const lastName = 'Account'
  const userName = 'testaccount1'
  const email = testingUserEmail
  const { data, error } = await supabase.auth.signUp({
    email: email,
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
  // console.log('data: ', data)
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

const seedProjects = async (numEntries, userId) => {
  logStep('Seeding projects...')
  const projects = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)

    projects.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      description: faker.lorem.paragraphs(2),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      collaborators: faker.helpers.arrayElements([userId]),
    })
  }

  const { data, error } = await supabase.from('projects').insert(projects).select('id')

  if (error) return logErrorAndExit('Projects', error)

  logStep('Projects seeded successfully.')

  return data
}

const seedTasks = async (numEntries, projectsIds, userId) => {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    tasks.push({
      name: faker.lorem.words(3),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      description: faker.lorem.paragraph(),
      due_date: faker.date.future(),
      profile_id: userId,
      project_id: faker.helpers.arrayElement(projectsIds),
      collaborators: faker.helpers.arrayElements([userId]),
    })
  }

  const { data, error } = await supabase.from('tasks').insert(tasks).select('id')

  if (error) return logErrorAndExit('Tasks', error)

  logStep('Tasks seeded successfully.')

  return data
}

const seedEmails = async (record) => {
  const emails = record.emails_display.split(';')
  emails.forEach((email) => {
    emailsRecords.push({
      report_id: record.id,
      profile_id: record.profile_id,
      email: email,
    })
  })
}

const seedDepartments = async (record) => {
  const departments = record.departments_display.split('%')
  departments.forEach((department) => {
    departmentsRecords.push({
      report_id: record.id,
      profile_id: record.profile_id,
      name: department,
    })
  })
}

const seedReports = async (numEntries) => {
  const reports = []

  for (let i = 0; i < numEntries; i++) {
    let departments = []
    let emails = []

    for (let i = 0; i < 60; i++) {
      departments.push(faker.commerce.department() + '-' + faker.number.int({ min: 100, max: 999 }))
      emails.push(faker.internet.email() + '-' + faker.number.int({ min: 100, max: 999 }))
    }

    const fDepts = faker.helpers.arrayElements(departments, { min: 2, max: 4 })
    const fEmails = faker.helpers.arrayElements(emails, { min: 1, max: 6 })

    let joinedDepartments = fDepts.join('%')
    let joinedEmails = fEmails.join(';')

    reports.push({
      profile_id: profileId,
      departments_display: joinedDepartments,
      emails_display: joinedEmails,
      subject: faker.lorem.words(4, { min: 1, max: 4 }).replaceAll(' ', '_'),
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

  const records = await supabase.from('reports').insert(reports).select('*')

  records.data.forEach(async (record) => {
    await seedEmails(record)
    await seedDepartments(record)
  })

  await supabase.from('emails').insert(emailsRecords)
  await supabase.from('departments').insert(departmentsRecords)

  console.log(
    `Seeded ${numEntriesPerTable} records with ${emailsRecords.length} emails and ${departmentsRecords.length} departments`,
  )

  return records.data
}

const seedDatabase = async (numEntriesPerTable) => {
  let userId

  const testUserId = await PrimaryTestUserExists()

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser()
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }

  const projectsIds = (await seedProjects(numEntriesPerTable, userId)).map((project) => project.id)
  await seedTasks(numEntriesPerTable, projectsIds, userId)

  const reportsIds = (await seedReports(numEntriesPerTable, userId)).map((report) => report.id)
  console.log(reportsIds)
}



// seedDatabase(numEntriesPerTable)






// const seedDatabase = async (numEntriesPerTable) => {
//   let userId

//   const testUserId = await PrimaryTestUserExists()

//   if (!testUserId) {
//     const primaryTestUserId = await createPrimaryTestUser()
//     userId = primaryTestUserId
//   } else {
//     userId = testUserId
//   }


//   // console.log(reportsIds)
// }


await seedDatabase(numEntriesPerTable)
