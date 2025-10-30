import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./CandidateProfileTimeline.css";

// Map stage to readable label and color
const STAGE_LABELS = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected"
};
const STAGE_COLORS = {
  applied: "#6c757d",
  screening: "#007bff",
  interview: "#ffc107",
  offer: "#17a2b8",
  hired: "#28a745",
  rejected: "#dc3545"
};

const CandidateProfile = ({ candidate }) => {
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(true);

  useEffect(() => {
    if (!candidate || !candidate.id) {
      setTimelineLoading(false);
      return;
    }

    const fetchTimeline = async () => {
      try {
        setTimelineLoading(true);
        const res = await fetch(`/candidates/${candidate.id}/timeline`);
        if (!res.ok) {
          console.warn(`Timeline not found: ${res.status} ${res.statusText}`);
          setTimeline([]);
          return;
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Invalid response format: Expected JSON');
          setTimeline([]);
          return;
        }

        const data = await res.json();
        setTimeline(data);
      } catch (e) {
        console.error('Error fetching timeline:', e);
        setTimeline([]);
      } finally {
        setTimelineLoading(false);
      }
    };
    fetchTimeline();
  }, [candidate]);

  if (!candidate) {
    return <div className="candidate-profile-error">Candidate not found</div>;
  }

  return (
    <div className="candidate-profile-page">
      <div className="candidate-profile">
        <div className="candidate-profile-header">
          <div className="avatar">
            {(candidate.name || '?').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="candidate-info">
            <h2 className="candidate-name">{candidate.name}</h2>
            <p className="candidate-email">{candidate.email}</p>
          </div>
        </div>
        <div className="candidate-details">
          {candidate.experience !== undefined && (
            <div className="candidate-detail">
              <strong>Experience:</strong> {candidate.experience} years
            </div>
          )}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="candidate-detail">
              <strong>Skills:</strong> {candidate.skills.join(', ')}
            </div>
          )}
          {candidate.stage && (
            <div className="candidate-detail">
              <strong>Current Stage:</strong> <span style={{ color: STAGE_COLORS[candidate.stage] }}>{STAGE_LABELS[candidate.stage] || candidate.stage}</span>
            </div>
          )}
        </div>
      </div>

      <h3 className="timeline-title">Status Timeline</h3>
      {timelineLoading ? (
        <div>Loading timeline...</div>
      ) : (
        <ul className="candidate-timeline">
          {timeline.length === 0 ? (
            <li>No timeline found.</li>
          ) : (
            timeline.map((event, index) => (
              <li key={`${event.timestamp}-${index}`} className="timeline-event">
                <span
                  className="timeline-dot"
                  style={{ backgroundColor: STAGE_COLORS[event.stage] }}
                ></span>
                <div className="timeline-content">
                  <span className="timeline-label" style={{ color: STAGE_COLORS[event.stage] }}>
                    {STAGE_LABELS[event.stage] || event.stage}
                  </span>
                  <span className="timeline-date">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                  {event.note && <div className="timeline-notes">{event.note}</div>}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

CandidateProfile.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    experience: PropTypes.number,
    skills: PropTypes.arrayOf(PropTypes.string),
    stage: PropTypes.string,
  }),
};

export default CandidateProfile;
