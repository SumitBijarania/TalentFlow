import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/jobs?page=1&pageSize=1000`);
        if (!response.ok) throw new Error('Failed to fetch job');
        const data = await response.json();
        const foundJob = data.data.find(j => j.id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleArchiveToggle = async () => {
    try {
      const newStatus = job.status === 'archived' ? 'active' : 'archived';
      const response = await fetch(`/jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update job');
      
      setJob({ ...job, status: newStatus });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="job-detail">Loading...</div>;
  if (error) return <div className="job-detail">Error: {error}</div>;
  if (!job) return <div className="job-detail">Job not found</div>;

  return (
    <div className="job-detail">
      <div className="job-detail-header">
        <Link to="/" className="back-link">← Back to Jobs</Link>
        <div className="job-detail-actions">
          <button 
            className="button secondary"
            onClick={handleArchiveToggle}
          >
            {job.status === 'archived' ? 'Unarchive' : 'Archive'}
          </button>
          <Link to={`/assessments/${job.id}`} className="button primary">
            View Assessment
          </Link>
        </div>
      </div>

      <div className="job-detail-content">
        <div className="job-detail-main">
          <h1>{job.title}</h1>
          
          <div className="job-meta">
            <span className={`job-status-badge ${job.status}`}>{job.status}</span>
            <span className="job-meta-item">📍 {job.location}</span>
            <span className="job-meta-item">🏢 {job.department}</span>
            <span className="job-meta-item">💼 {job.employmentType}</span>
            <span className="job-meta-item">⭐ {job.experienceLevel}</span>
          </div>

          <div className="job-section">
            <h2>Description</h2>
            <p>{job.description}</p>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="job-section">
              <h2>Required Skills</h2>
              <div className="skills-list">
                {job.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          <div className="job-section">
            <h2>Job Details</h2>
            <div className="job-details-grid">
              <div className="detail-item">
                <strong>Job ID:</strong> {job.id}
              </div>
              <div className="detail-item">
                <strong>Slug:</strong> {job.slug || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Posted:</strong> {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Order:</strong> {job.order}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;