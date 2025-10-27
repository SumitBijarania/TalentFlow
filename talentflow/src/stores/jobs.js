import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { db } from '../db/index.js';

const useJobsStore = create(devtools((set, get) => ({
  jobs: [],
  fetchJobs: async () => {
    const jobs = await db.jobs.toArray();
    set({ jobs });
  },
  addJob: async (job) => {
    const res = await fetch('/jobs', { method: 'POST', body: JSON.stringify(job), headers: { 'Content-Type': 'application/json' } });
    if (res.ok) {
      const newJob = await res.json();
      await db.jobs.add(newJob);
      set(state => ({ jobs: [...state.jobs, newJob] }));
    }
  },
  updateJob: async (id, updates) => {
    const res = await fetch(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(updates), headers: { 'Content-Type': 'application/json' } });
    if (res.ok) {
      await db.jobs.update(id, updates);
      set(state => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j) }));
    }
  },
  reorderJobs: async (fromOrder, toOrder) => {
    const originalJobs = [...get().jobs];
    const fromJob = originalJobs.find(j => j.order === fromOrder);
    const toJob = originalJobs.find(j => j.order === toOrder);
    if (fromJob && toJob) {
      set(state => ({
        jobs: state.jobs.map(j =>
          j.id === fromJob.id ? { ...j, order: toOrder } :
          j.id === toJob.id ? { ...j, order: fromOrder } : j
        ),
      }));
      const res = await fetch(`/jobs/${fromJob.id}/reorder`, { method: 'PATCH', body: JSON.stringify({ fromOrder, toOrder }), headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) {
        set({ jobs: originalJobs }); // Rollback
      } else {
        await db.jobs.update(fromJob.id, { order: toOrder });
        await db.jobs.update(toJob.id, { order: fromOrder });
      }
    }
  },
})));

export { useJobsStore };