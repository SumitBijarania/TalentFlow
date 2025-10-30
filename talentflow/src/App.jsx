import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import JobsBoard from './components/JobsBoard.jsx';
import JobDetail from './components/JobDetail.jsx';
import CandidatesList from './components/CandidatesList.jsx';
import CandidateKanban from './components/CandidateKanban.jsx';
import CandidateProfile from './components/CandidateProfile.jsx';
import AssessmentsBuilder from './components/AssessmentsBuilder.jsx';
import AssessmentsList from './components/AssessmentsList.jsx';
import Layout from './components/Layout.jsx';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CandidateProfileWrapper() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`/candidates/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch candidate: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format: Expected JSON');
        }
        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <CandidateProfile candidate={candidate} />;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<JobsBoard />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/candidates" element={<CandidatesList />} />
          <Route path="/candidates/kanban" element={<CandidateKanban />} />
          <Route path="/candidates/:id" element={<CandidateProfileWrapper />} />
          <Route path="/assessments" element={<AssessmentsList />} />
          <Route path="/assessments/:jobId" element={<AssessmentsBuilder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;