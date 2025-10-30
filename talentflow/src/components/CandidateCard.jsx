import React from 'react';
import PropTypes from 'prop-types';

const STAGE_BG_COLORS = {
  applied: "#FFF0F6",
  screening: "#FFFBE0",
  interview: "#E9FCEB",
  offer: "#EAF4FF",
  hired: "#EBFFF3",
  rejected: "#FFEDED"
};
// Use this in CandidateCard


const CandidateCard = ({ candidate, onDragStart, onDragEnd }) => {
  return (
    <div
      className={`kanban-card stage-${candidate.stage}`}
      draggable
      onDragStart={e => onDragStart(e, candidate)}
      onDragEnd={onDragEnd}
      style={{
        marginBottom: 12,
        borderRadius: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
        background: STAGE_BG_COLORS[candidate.stage] || "#fff",
        transition: 'box-shadow 0.2s'
      }}
    >
      <div className="kanban-card-header">
        <div className="avatar">
          {(candidate.name || '?').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="title-block">
          <div className="kanban-card-name">{candidate.name}</div>
          <div className="kanban-card-email">{candidate.email}</div>
        </div>
      </div>
      <div className="kanban-card-meta">
        {candidate.experience !== undefined && (
          <div className="kanban-card-experience">{candidate.experience} yrs exp</div>
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
      </div>
    </div>
  );
};

CandidateCard.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    stage: PropTypes.string.isRequired,
    experience: PropTypes.number,
    skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

export default CandidateCard;
