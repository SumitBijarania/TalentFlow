import React, { useState } from 'react';

const CandidateForm = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('applied');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ 
      name,
      email,
      stage,
      notes: []
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Candidate</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stage">Stage</label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button secondary">
              Cancel
            </button>
            <button type="submit" className="button primary">
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;