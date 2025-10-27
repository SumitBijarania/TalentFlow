import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [candidates, setCandidates] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

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

  return (
    <div className="candidates-list">
      <div className="candidates-header">
        <h2>Candidates</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>
          + Add Candidate
        </button>
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

      <div className="candidates-grid">
        {candidates.data.map(candidate => (
          <Link to={'/candidates/' + candidate.id} key={candidate.id} className="candidate-card">
            <h3>{candidate.name}</h3>
            <div className="candidate-email">{candidate.email}</div>
            <div 
              className="candidate-stage"
              style={{ backgroundColor: getStageColor(candidate.stage) }}
            >
              {candidate.stage}
            </div>
          </Link>
        ))}
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