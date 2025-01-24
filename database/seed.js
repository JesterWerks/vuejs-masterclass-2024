/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-env node */
import { fakerEN_US as faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

const NUM_ENTRIES = 4;
const emails = [];
const departments = [];
const reports = [];
let profileId = '';

const logStep = (message) => console.log(message);
const logErrorAndExit = (table, error) => {
  console.error(`Error in table '${table}': ${error.message}`);
  process.exit(1);
};
const hr = () => console.log('='.repeat(40));

const TESTING_USER_EMAIL = process.env.TESTING_USER_EMAIL;
if (!TESTING_USER_EMAIL) {
  console.error('Missing TESTING_USER_EMAIL in .env file');
  process.exit(1);
}

const checkPrimaryTestUser = async () => {
  logStep('Checking if primary test user exists...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', 'testaccount1')
    .single();

  if (error) {
    logStep('Primary test user not found. Creating...');
    return null;
  }

  logStep(`Primary test user found: id = ${data.id}`);
  profileId = data.id;
  return data.id;
};

const createPrimaryTestUser = async () => {
  logStep('Creating primary test user...');
  const userInfo = {
    firstName: 'Test',
    lastName: 'Account',
    username: 'testaccount1',
    email: TESTING_USER_EMAIL,
    password: 'password',
  };

  const { data, error } = await supabase.auth.signUp({
    email: userInfo.email,
    password: userInfo.password,
    options: {
      data: {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        full_name: `${userInfo.firstName} ${userInfo.lastName}`,
        username: userInfo.username,
      },
    },
  });

  if (error) logErrorAndExit('Users', error);

  profileId = data.user.id;
  await supabase.from('profiles').insert({
    id: profileId,
    full_name: `${userInfo.firstName} ${userInfo.lastName}`,
    username: userInfo.username,
    bio: 'The main testing account',
    avatar_url: `https://i.pravatar.cc/150?u=${profileId}`,
  });

  logStep('Primary test user created successfully.');
  return profileId;
};

const generateData = (numEntries) => {
  hr();
  logStep('Generating test data...');
  hr();

  const departmentNames = faker.helpers.uniqueArray(faker.commerce.department, 30);
  const emailAddresses = faker.helpers.uniqueArray(faker.internet.email, 30);

  for (let i = 0; i < numEntries; i++) {
    departments.push(faker.helpers.arrayElements(departmentNames, { min: 2, max: 4 }));
    emails.push(faker.helpers.arrayElements(emailAddresses, { min: 1, max: 4 }));
  }

  for (let i = 0; i < numEntries; i++) {
    reports.push({
      profile_id: profileId,
      departments_display: departments[i].join('%'),
      emails_display: emails[i].join(';'),
      subject: departments[i].join('%').replace(/%/g, '_'),
      rowsort: faker.helpers.arrayElement([0, 1]),
      cc_email: faker.internet.email(),
      columnsort: faker.helpers.arrayElement([0, 1]),
      login_filter: faker.helpers.arrayElement([0, 1]),
      completion_filter: faker.helpers.arrayElement([0, 1]),
      remove_button: faker.helpers.arrayElement([0, 1]),
      course_type_only: faker.helpers.arrayElement([0, 1]),
      ple_only: faker.helpers.arrayElement([0, 1]),
      summary_only: faker.helpers.arrayElement([0, 1]),
    });
  }

  logStep('Data generation completed.');
};

const seedTable = async (tableName, data) => {
  const { error } = await supabase.from(tableName).upsert(data);
  if (error) logErrorAndExit(tableName, error);
};

const seedDatabase = async () => {
  logStep('Seeding emails...');
  await seedTable('emails', emails.flat().map((email) => ({ email_address: email })));

  logStep('Seeding departments...');
  await seedTable('departments', departments.flat().map((name) => ({ name })));

  logStep('Seeding reports...');
  await seedTable('reports', reports);

  logStep('Database seeding completed.');
};

(async () => {
  const testUserId = await checkPrimaryTestUser();
  if (!testUserId) await createPrimaryTestUser();

  generateData(NUM_ENTRIES);
  await seedDatabase();
})();
