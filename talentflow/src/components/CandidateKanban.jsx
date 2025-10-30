import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CandidateCard from './CandidateCard';

const STAGES = [
  { id: 'applied', label: 'Applied', color: '#FF6B9D' },
  { id: 'screening', label: 'Screening', color: '#FFD93D' },
  { id: 'interview', label: 'Interview', color: '#6BCB77' },
  { id: 'offer', label: 'Offer', color: '#4D96FF' },
  { id: 'hired', label: 'Hired', color: '#28a745' },
  { id: 'rejected', label: 'Rejected', color: '#dc3545' }
];

const CandidateKanban = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('pageSize', '1000');
      if (search) params.append('search', search);

      const response = await fetch('/candidates?' + params.toString());
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      setCandidates(data.data || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  // Load jobs for job filter
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch('/jobs?page=1&pageSize=1000');
        if (!res.ok) return;
        const data = await res.json();
        setJobs(data.data || []);
      } catch (e) {
        // ignore
      }
    };
    loadJobs();
  }, []);

  // Drag-and-drop handlers
  const handleDragStart = (e, candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedCandidate(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    setDragOverColumn(stageId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedCandidate || draggedCandidate.stage === newStage) {
      return;
    }
    try {
      const updatedCandidate = { ...draggedCandidate, stage: newStage };
      setCandidates(prev =>
        prev.map(c => c.id === draggedCandidate.id ? updatedCandidate : c)
      );
      const response = await fetch(`/candidates/${draggedCandidate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      if (!response.ok) throw new Error('Failed to update candidate stage');
    } catch (err) {
      setCandidates(prev =>
        prev.map(c => c.id === draggedCandidate.id ? draggedCandidate : c)
      );
    }
  };

  const getCandidatesByStage = (stageId) =>
    candidates.filter(candidate => candidate.stage === stageId)
      .filter(c => !selectedJobId || c.jobId === selectedJobId)
      .filter(c => !search || (c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())));

  // Prepare 3x2 structure
  const ROWS = [
    STAGES.slice(0, 3), // first 3 columns
    STAGES.slice(3, 6), // next 3 columns
  ];

  if (loading) return <div className="kanban-loading">Loading...</div>;
  if (error) return <div className="kanban-error">Error: {error}</div>;

  return (
    <div className="candidate-kanban">
      <div className="kanban-header">
        <h2>Candidate Pipeline</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
            <option value="">All Jobs</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
          <input
            className="kanban-searchbox"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="button secondary" onClick={() => navigate('/candidates')}>📋 List View</button>
        </div>
      </div>

      <div className="kanban-board-matrix">
        {ROWS.map((row, rowIdx) => (
          <div className="kanban-board-row" key={rowIdx}>
            {row.map(stage => (
              <div
                key={stage.id}
                className={`kanban-column-matrix ${dragOverColumn === stage.id ? "drag-over" : ""}`}
                onDragOver={e => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage.id)}
              >
                <div className="kanban-column-header-matrix" style={{ background: stage.color }}>
                  <span>{stage.label}</span>
                  <span className="candidate-count">{getCandidatesByStage(stage.id).length}</span>
                </div>
                <div className="kanban-cards-matrix">
                  {getCandidatesByStage(stage.id).map(candidate => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateKanban;
