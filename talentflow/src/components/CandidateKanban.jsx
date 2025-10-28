import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STAGES = [
  { id: 'applied', label: 'Applied', color: '#6c757d' },
  { id: 'screening', label: 'Screening', color: '#007bff' },
  { id: 'interview', label: 'Interview', color: '#ffc107' },
  { id: 'offer', label: 'Offer', color: '#17a2b8' },
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

  const handleDragStart = (e, candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedCandidate(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
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
      
      const response = await fetch(`/candidates/${draggedCandidate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) throw new Error('Failed to update candidate stage');

      
      setCandidates(prev => 
        prev.map(c => 
          c.id === draggedCandidate.id 
            ? { ...c, stage: newStage }
            : c
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getCandidatesByStage = (stage) => {
    return candidates.filter(c => c.stage === stage);
  };

  if (loading) return <div className="kanban-loading">Loading candidates...</div>;
  if (error) return <div className="kanban-error">Error: {error}</div>;

  return (
    <div className="candidate-kanban">
      <div className="kanban-header">
        <h2>Candidate Pipeline</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            className="button secondary" 
            onClick={() => navigate('/candidates')}
          >
            📋 List View
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {STAGES.map(stage => (
          <div
            key={stage.id}
            className={`kanban-column ${dragOverColumn === stage.id ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div 
              className="kanban-column-header"
              style={{ borderTopColor: stage.color }}
            >
              <h3>{stage.label}</h3>
              <span className="candidate-count">
                {getCandidatesByStage(stage.id).length}
              </span>
            </div>
            
            <div className="kanban-cards">
              {getCandidatesByStage(stage.id).map(candidate => (
                <div
                  key={candidate.id}
                  className="kanban-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, candidate)}
                  onDragEnd={handleDragEnd}
                >
                  <Link to={`/candidates/${candidate.id}`} className="kanban-card-link">
                    <div className="kanban-card-name">{candidate.name}</div>
                    <div className="kanban-card-email">{candidate.email}</div>
                    {candidate.experience !== undefined && (
                      <div className="kanban-card-experience">
                        {candidate.experience} years exp
                      </div>
                    )}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="kanban-card-skills">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="skill-more">+{candidate.skills.length - 3}</span>
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
              
              {getCandidatesByStage(stage.id).length === 0 && (
                <div className="kanban-empty">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateKanban;
