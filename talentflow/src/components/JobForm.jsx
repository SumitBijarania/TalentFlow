import React, { useState, useEffect } from 'react';

const JobForm = ({ job, onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setSlug(job.slug || '');
      setStatus(job.status || 'active');
      setDescription(job.description || '');
      setLocation(job.location || '');
      setDepartment(job.department || '');
      setExperienceLevel(job.experienceLevel || 'Mid');
      setEmploymentType(job.employmentType || 'Full-time');
      setRequiredSkills(job.requiredSkills ? job.requiredSkills.join(', ') : '');
    }
  }, [job]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!job && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, job]);

  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const jobData = {
      title,
      slug,
      status,
      description,
      location,
      department,
      experienceLevel,
      employmentType,
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      order: job?.order ?? Date.now()
    };

    await onSubmit(jobData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <h2>{job ? 'Edit Job' : 'Add New Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="slug">Slug *</label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={errors.slug ? 'error' : ''}
              />
              {errors.slug && <span className="error-message">{errors.slug}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="requiredSkills">Required Skills (comma-separated)</label>
            <input
              type="text"
              id="requiredSkills"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="JavaScript, React, Node.js"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button secondary">
              Cancel
            </button>
            <button type="submit" className="button primary">
              {job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;