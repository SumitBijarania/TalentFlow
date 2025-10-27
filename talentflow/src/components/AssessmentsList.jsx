import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs first to get their details
        const jobsResponse = await fetch('/jobs?pageSize=1000');
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.data);

        // Fetch all assessments
        const assessmentsPromises = jobsData.data.map(job =>
          fetch(`/assessments/${job.id}`).then(res => res.json())
        );
        
        const assessmentsData = await Promise.all(assessmentsPromises);
        const validAssessments = assessmentsData
          .filter(assessment => assessment.sections && assessment.sections.length > 0)
          .map(assessment => ({
            ...assessment,
            job: jobsData.data.find(job => job.id === assessment.jobId)
          }));

        setAssessments(validAssessments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading assessments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="assessments-list">
      <div className="assessments-header">
        <h2>Assessments</h2>
        <Link to="/assessments/new" className="add-button">
          + Create Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="no-assessments">
          No assessments found. Click 'Create Assessment' to create your first assessment.
        </div>
      ) : (
        <div className="assessments-grid">
          {assessments.map(assessment => (
            <Link
              to={`/assessments/${assessment.jobId}`}
              key={assessment.jobId}
              className="assessment-card"
            >
              <h3>{assessment.job?.title || 'Untitled Job'}</h3>
              <div className="assessment-details">
                <div>Sections: {assessment.sections.length}</div>
                <div>Questions: {assessment.sections.reduce((total, section) => 
                  total + section.questions.length, 0)}</div>
                <div>Time Limit: {assessment.timeLimit} minutes</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentsList;