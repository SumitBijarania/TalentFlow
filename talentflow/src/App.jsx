import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import JobsBoard from './components/JobsBoard.jsx';
import JobDetail from './components/JobDetail.jsx';
import CandidatesList from './components/CandidatesList.jsx';
import CandidateProfile from './components/CandidateProfile.jsx';
import AssessmentsBuilder from './components/AssessmentsBuilder.jsx';
import AssessmentsList from './components/AssessmentsList.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<JobsBoard />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/candidates" element={<CandidatesList />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
          <Route path="/assessments" element={<AssessmentsList />} />
          <Route path="/assessments/:jobId" element={<AssessmentsBuilder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;