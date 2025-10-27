import Dexie from 'dexie';

import { generateJobs, generateCandidates, generateAssessments } from './seed.js';

export const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  jobs: 'id, title, status, order, postedDate, department, location, experienceLevel, employmentType',
  candidates: 'id, name, email, stage, jobId, appliedDate, lastUpdated, location, experience, education',
  assessments: 'jobId, title, timeLimit'
});

// Initialize the database with seed data
const initializeDatabase = async () => {
  const jobCount = await db.jobs.count();
  
  if (jobCount === 0) {
    console.log('Initializing database with seed data...');
    
    try {
      // Generate and add jobs
      const jobs = generateJobs();
      await db.jobs.bulkAdd(jobs);
      console.log(`Added ${jobs.length} jobs`);

  // Generate and add assessments (per job, role-specific)
  const assessments = generateAssessments(jobs);
      await db.assessments.bulkAdd(assessments);
      console.log(`Added ${assessments.length} assessments`);

      // Generate and add candidates
  const jobIds = jobs.map(job => job.id);
  const candidates = generateCandidates(jobIds);
      await db.candidates.bulkAdd(candidates);
      console.log(`Added ${candidates.length} candidates`);

      console.log('Database initialization complete!');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  } else {
    console.log('Database already contains data, skipping initialization');
    // Backfill: ensure every job has an assessment
    try {
      const jobs = await db.jobs.toArray();
      const missing = [];
      let updatedCount = 0;
      for (const job of jobs) {
        const existing = await db.assessments.get(job.id);
        if (!existing) {
          missing.push(job);
        } else {
          // Ensure Technical Assessment section has questions
          const techIdx = (existing.sections || []).findIndex(s => s.title === 'Technical Assessment');
          if (techIdx >= 0) {
            const tech = existing.sections[techIdx];
            if (!Array.isArray(tech.questions) || tech.questions.length === 0) {
              const fresh = generateAssessments([job])[0];
              const freshTech = (fresh.sections || []).find(s => s.title === 'Technical Assessment');
              if (freshTech) {
                existing.sections[techIdx] = { ...tech, questions: freshTech.questions };
                await db.assessments.put({ ...existing, updatedAt: new Date() });
                updatedCount++;
              }
            }
          }
        }
      }
      if (missing.length) {
        const backfill = generateAssessments(missing);
        await db.assessments.bulkPut(backfill);
        console.log(`Backfilled ${backfill.length} assessments`);
      }
      if (updatedCount) {
        console.log(`Updated ${updatedCount} assessments with technical questions`);
      }
    } catch (error) {
      console.error('Error backfilling assessments:', error);
    }
  }
};

// Run the initialization
initializeDatabase();