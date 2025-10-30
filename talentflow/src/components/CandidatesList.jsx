import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CandidateForm from './CandidateForm';

const getStageColor = (stage) => {
  const colors = {
    applied: '#6c757d',   
    screening: '#007bff',  
    interview: '#ffc107',  
    offer: '#17a2b8',     
    hired: '#28a745',     
    rejected: '#dc3545'    
  };
  return colors[stage] || colors.applied;
};

const CandidatesList = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [jobsMap, setJobsMap] = useState({});
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedStage) params.append('stage', selectedStage);
      
      params.append('page', '1');
      params.append('pageSize', '1000');

      const response = await fetch('/candidates?' + params.toString());
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, selectedStage]);

  // Fetch jobs once to map jobId -> title
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch('/jobs?page=1&pageSize=1000');
        if (!res.ok) return;
        const data = await res.json();
        const map = {};
        data.data.forEach(j => { map[j.id] = j.title; });
        setJobsMap(map);
      } catch (e) {
        // ignore
      }
    };
    loadJobs();
  }, []);

  const handleAddCandidate = async (candidateData) => {
    try {
      const response = await fetch('/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) throw new Error('Failed to create candidate');
      
      // Refresh the candidates list
      fetchCandidates();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading candidates...</div>;
  if (error) return <div>Error: {error}</div>;

  // Sorting and pagination (client-side)
  const sorted = [...(candidates.data || [])].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
    if (sortBy === 'email') return a.email.localeCompare(b.email) * dir;
    if (sortBy === 'stage') return a.stage.localeCompare(b.stage) * dir;
    if (sortBy === 'job') {
      const aj = jobsMap[a.jobId] || '';
      const bj = jobsMap[b.jobId] || '';
      return aj.localeCompare(bj) * dir;
    }
    // appliedDate default
    const ad = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
    const bd = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
    return (ad - bd) * dir;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageClamped = Math.min(page, totalPages);
  const start = (pageClamped - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="candidates-list">
      <div className="candidates-header">
        <h2>Candidates</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="button secondary" 
            onClick={() => navigate('/candidates/kanban')}
          >
            📊 Kanban View
          </button>
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Add Candidate
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="stage-filter"
        >
          <option value="">All Stages</option>
          <option value="applied">Applied</option>
          <option value="screening">Screening</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="candidates-table-wrap">
        <table className="candidates-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name</th>
              <th onClick={() => toggleSort('email')}>Email</th>
              <th onClick={() => toggleSort('job')}>Job</th>
              <th onClick={() => toggleSort('stage')}>Stage</th>
              <th onClick={() => toggleSort('appliedDate')}>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(candidate => (
              <tr key={candidate.id}>
                <td>
                  <Link to={'/candidates/' + candidate.id} className="candidate-link">{candidate.name}</Link>
                </td>
                <td>{candidate.email}</td>
                <td>{jobsMap[candidate.jobId] || '—'}</td>
                <td>
                  <span className="stage-badge" style={{ backgroundColor: getStageColor(candidate.stage) }}>
                    {candidate.stage}
                  </span>
                </td>
                <td>{candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : '—'}</td>
                <td>
                  <Link to={'/candidates/' + candidate.id} className="button small">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="button secondary" disabled={pageClamped <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span className="page-info">Page {pageClamped} of {totalPages}</span>
        <button className="button secondary" disabled={pageClamped >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
      </div>
      
      {candidates.data.length === 0 && (
        <div className="no-candidates">
          No candidates found. {!search && !selectedStage && "Click 'Add Candidate' to add your first candidate."}
        </div>
      )}

      {showForm && (
        <CandidateForm
          onSubmit={handleAddCandidate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CandidatesList;