import { http } from 'msw';
import { db } from '../db/index.js';


const simulateNetwork = async (request) => {
  // Add random delay between 200-1200ms
  const delay = 200 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate 5-10% error rate for write operations (POST, PATCH, PUT, DELETE)
  const writeOperations = ['POST', 'PATCH', 'PUT', 'DELETE'];
  if (writeOperations.includes(request.method) && Math.random() < 0.075) {
    throw new Error('Simulated network error - request failed');
  }
};

// Helper function for JSON responses with error handling
const jsonResponse = (data) => {
  try {
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const handlers = [
  // Static assets handler
  http.get('*.{ico,html,css,js,png,jpg,jpeg,gif,svg}', async ({ request }) => {
    return Response.json({ message: 'Static asset request' });
  }),
  // Root path handler
  http.get('/', async () => {
    return Response.json({ message: 'Root path' });
  }),
  http.get('/jobs', async ({ request }) => {
    try {
      await simulateNetwork(request);
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || '';
      const tags = url.searchParams.get('tags') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      
      let jobs = await db.jobs.toArray();
      
      // Filter by search (title)
      if (search) {
        jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
      }
      
      // Filter by status
      if (status) {
        jobs = jobs.filter(j => j.status === status);
      }
      
      // Filter by tags (skills)
      if (tags) {
        const tagSearch = tags.toLowerCase();
        jobs = jobs.filter(j => 
          j.requiredSkills && j.requiredSkills.some(skill => 
            skill.toLowerCase().includes(tagSearch)
          )
        );
      }
      
      // Sort by order
      jobs.sort((a, b) => a.order - b.order);
      
      // Paginate
      const start = (page - 1) * pageSize;
      const paginated = jobs.slice(start, start + pageSize);
      
      return jsonResponse({ data: paginated, total: jobs.length });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.post('/jobs', async ({ request }) => {
    try {
      await simulateNetwork(request);
      const body = await request.json();
      const job = { ...body, id: crypto.randomUUID() };
      await db.jobs.add(job);
      return jsonResponse(job);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.patch('/jobs/:id', async ({ request, params }) => {
    try {
      await simulateNetwork(request);
      const { id } = params;
      const updates = await request.json();
      await db.jobs.update(id, updates);
      return jsonResponse({});
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.patch('/jobs/:id/reorder', async ({ request }) => {
    try {
      await simulateNetwork(request);
      const { fromOrder, toOrder } = await request.json();
      const jobs = await db.jobs.toArray();
      const fromJob = jobs.find(j => j.order === fromOrder);
      const toJob = jobs.find(j => j.order === toOrder);
      if (fromJob && toJob) {
        await db.jobs.update(fromJob.id, { order: toOrder });
        await db.jobs.update(toJob.id, { order: fromOrder });
      }
      return jsonResponse({});
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.get('/candidates', async ({ request }) => {
    try {
      await simulateNetwork(request);
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const stage = url.searchParams.get('stage') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      let candidates = await db.candidates.toArray();
      if (search) candidates = candidates.filter(c => c.name.includes(search) || c.email.includes(search));
      if (stage) candidates = candidates.filter(c => c.stage === stage);
      const start = (page - 1) * pageSize;
      const paginated = candidates.slice(start, start + pageSize);
      return jsonResponse({ data: paginated, total: candidates.length });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.post('/candidates', async ({ request }) => {
    try {
      await simulateNetwork(request);
      const body = await request.json();
      const candidate = { ...body, id: crypto.randomUUID() };
      await db.candidates.add(candidate);
      return jsonResponse(candidate);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.patch('/candidates/:id', async ({ request, params }) => {
    try {
      await simulateNetwork(request);
      const { id } = params;
      const updates = await request.json();
      await db.candidates.update(id, updates);
      return jsonResponse({});
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.get('/candidates/:id/timeline', async ({ params, request }) => {
    try {
      await simulateNetwork(request);
      const { id } = params;
      const candidate = await db.candidates.get(id);
      const timeline = candidate?.notes.map(n => ({ timestamp: n.timestamp, stage: candidate.stage, note: n.text })) || [];
      return jsonResponse(timeline);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.get('/assessments/:jobId', async ({ params, request }) => {
    try {
      await simulateNetwork(request);
      const { jobId } = params;
      const assessment = await db.assessments.get(jobId);
      return jsonResponse(assessment || { jobId, sections: [] });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.put('/assessments/:jobId', async ({ request, params }) => {
    try {
      await simulateNetwork(request);
      const { jobId } = params;
      const body = await request.json();
      await db.assessments.put(body);
      return jsonResponse(body);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),

  http.post('/assessments/:jobId/submit', async ({ request, params }) => {
    try {
      await simulateNetwork(request);
      const { jobId } = params;
      const responses = await request.json();
      console.log('Submitted responses for job', jobId, responses);
      return jsonResponse({ success: true });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
];