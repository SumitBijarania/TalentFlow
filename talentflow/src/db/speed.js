import { faker } from '@faker-js/faker';
import { db } from './index.js';

export async function seedData() {
  const jobsExist = await db.jobs.count();
  if (jobsExist > 0) return;

  // Seed 25 jobs
  const jobs = [];
  for (let i = 0; i < 25; i++) {
    jobs.push({
      id: faker.string.uuid(),
      title: faker.person.jobTitle(),
      slug: faker.lorem.slug(),
      status: faker.helpers.arrayElement(['active', 'archived']),
      tags: faker.helpers.arrayElements(['remote', 'full-time', 'senior'], 2),
      order: i,
    });
  }
  await db.jobs.bulkAdd(jobs);

  // Seed 1000 candidates
  const candidates = [];
  for (let i = 0; i < 1000; i++) {
    candidates.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      stage: faker.helpers.arrayElement(['applied', 'screen', 'tech', 'offer', 'hired', 'rejected']),
      jobId: faker.helpers.arrayElement(jobs).id,
      notes: [],
    });
  }
  await db.candidates.bulkAdd(candidates);

  // Seed 3 assessments
  const assessments = [];
  for (let i = 0; i < 3; i++) {
    const sections = [];
    for (let j = 0; j < 3; j++) {
      const questions = [];
      for (let k = 0; k < 5; k++) {
        questions.push({
          id: faker.string.uuid(),
          type: faker.helpers.arrayElement(['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric', 'file-upload']),
          question: faker.lorem.sentence(),
          options: ['Option 1', 'Option 2'],
          required: faker.datatype.boolean(),
          range: { min: 0, max: 100 },
          maxLength: 200,
          condition: k > 2 ? { dependsOn: questions[0].id, value: 'Yes' } : undefined,
        });
      }
      sections.push({ id: faker.string.uuid(), title: faker.lorem.words(3), questions });
    }
    assessments.push({ jobId: jobs[i].id, sections });
  }
  await db.assessments.bulkAdd(assessments);
}