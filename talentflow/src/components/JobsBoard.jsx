import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import JobForm from './JobForm'

const JobsBoard = () => {
  const [jobs, setJobs] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  // Filters and pagination
  const [searchTitle, setSearchTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTitle) params.append('search', searchTitle);
      if (filterStatus) params.append('status', filterStatus);
      if (filterTags) params.append('tags', filterTags);
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());

      const response = await fetch('/jobs?' + params.toString());
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTitle, filterStatus, filterTags, currentPage]);

  const handleAddJob = async (jobData) => {
    try {
      const response = await fetch('/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) throw new Error('Failed to create job');
      
      // Refresh the jobs list
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditJob = async (jobData) => {
    try {
      const response = await fetch(`/jobs/${editingJob.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) throw new Error('Failed to update job');
      
      // Refresh the jobs list
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleArchiveToggle = async (job) => {
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
      
      // Refresh the jobs list
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const totalPages = Math.ceil(jobs.total / pageSize);

  if (loading && jobs.data.length === 0) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="jobs-board">
      <div className="jobs-header">
        <h2>Jobs Board</h2>
        <button className="add-job" onClick={() => { setEditingJob(null); setShowJobForm(true); }}>
          + Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="status-filter"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <input
          type="text"
          placeholder="Filter by tags..."
          value={filterTags}
          onChange={(e) => {
            setFilterTags(e.target.value);
            setCurrentPage(1);
          }}
          className="tags-filter"
        />
      </div>

      <div className="jobs-grid">
        {jobs.data.map(job => (
          <div key={job.id} className="job-card">
            <Link to={`/jobs/${job.id}`} className="job-card-link">
              <h3>{job.title}</h3>
              <div className="job-status">{job.status}</div>
              {job.requiredSkills && (
                <div className="job-tags">
                  {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="tag">{skill}</span>
                  ))}
                </div>
              )}
            </Link>
            <div className="job-actions">
              <button 
                className="button secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingJob(job);
                  setShowJobForm(true);
                }}
              >
                Edit
              </button>
              <button 
                className="button secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchiveToggle(job);
                }}
              >
                {job.status === 'archived' ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {jobs.data.length === 0 && (
        <div className="no-jobs">
          No jobs found. Click "Add Job" to create your first job posting.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="button secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="button secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showJobForm && (
        <JobForm
          job={editingJob}
          onSubmit={editingJob ? handleEditJob : handleAddJob}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  )
}

export default JobsBoard