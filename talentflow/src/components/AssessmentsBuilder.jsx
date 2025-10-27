import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../db';

const QUESTION_TYPES = [
  'single-choice',
  'multi-choice',
  'short-text',
  'long-text',
  'numeric',
  'file-upload'
];

const TEXT_TEMPLATES = {
  'single-choice': 'Please select one of the following options.',
  'multi-choice': 'Please select all options that apply.',
  'short-text': 'Please provide a brief answer.',
  'long-text': 'Please provide a detailed answer.',
  'numeric': 'Please enter a numeric value.',
  'file-upload': 'Please upload the requested file.'
};

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

export default function AssessmentsBuilder() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const saveTimer = useRef(null);

  // preview answers used for conditional logic in preview
  const [previewAnswers, setPreviewAnswers] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!jobId) return;
      const jobData = await db.jobs.get(String(jobId));
      setJob(jobData || { id: jobId, title: `Job ${jobId}` });

      // load assessment by jobId
      const assessment = await db.assessments.where('jobId').equals(String(jobId)).first();
      if (assessment && assessment.sections) {
        setSections(assessment.sections);
        if (assessment.sections.length) setSelectedSectionId(assessment.sections[0].id);
      } else {
        setSections([]);
      }
    };
    load();
  }, [jobId]);

  // Debounced auto-save when sections change
  useEffect(() => {
    if (!jobId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveAssessment();
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const saveAssessment = async () => {
    try {
      await db.assessments.put({ jobId: String(jobId), sections, updatedAt: new Date() });
      setSavedAt(new Date());
    } catch (err) {
      console.error('Failed to save assessment', err);
    }
  };

  const addSection = () => {
    const newSection = {
      id: makeId(),
      title: 'New Section',
      description: '',
      questions: []
    };
    setSections(prev => {
      const next = [...prev, newSection];
      setSelectedSectionId(newSection.id);
      setSelectedQuestionId(null);
      return next;
    });
  };

  const addQuestion = (type = 'short-text') => {
    if (!selectedSectionId) return;
    const newQuestion = {
      id: makeId(),
      type,
      text: TEXT_TEMPLATES[type] || 'New question',
      required: false,
      options: [],
      validation: { minValue: null, maxValue: null, maxLength: null },
      conditionalRules: { dependsOn: null, showIf: null, value: null }
    };
    setSections(prev => prev.map(s => {
      if (s.id === selectedSectionId) {
        return { ...s, questions: [...(s.questions||[]), newQuestion] };
      }
      return s;
    }));
    setSelectedQuestionId(newQuestion.id);
  };

  const updateSection = (sectionId, updates) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...updates } : s));
  };

  const updateQuestion = (questionId, updates) => {
    setSections(prev => prev.map(s => {
      if (s.id !== selectedSectionId) return s;
      return { ...s, questions: s.questions.map(q => q.id === questionId ? { ...q, ...updates } : q) };
    }));
  };

  const onPreviewChange = (questionId, value) => {
    setPreviewAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const selectedSection = sections.find(s => s.id === selectedSectionId) || null;
  const selectedQuestion = selectedSection?.questions?.find(q => q.id === selectedQuestionId) || null;

  return (
    <div className="assessments-builder">
      <header className="assessments-builder-header">
        <h1>Assessment Builder {job ? `— ${job.title}` : ''}</h1>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <button className="button secondary" onClick={addSection}>Add Section</button>
          <span style={{fontSize:12, color:'#666'}}>{savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Not saved'}</span>
        </div>
      </header>

      <div className="builder-layout">
        <div className="sections-panel">
          <div className="sections-header">
            <h3>Sections</h3>
          </div>
          <div className="sections-list">
            {sections.map(s => (
              <div key={s.id} className={`section-item ${s.id === selectedSectionId ? 'selected' : ''}`} onClick={() => { setSelectedSectionId(s.id); setSelectedQuestionId(null); }}>
                <strong>{s.title || 'Untitled'}</strong>
                <div style={{fontSize:12, color:'#666'}}>{(s.questions||[]).length} questions</div>
              </div>
            ))}
            {sections.length === 0 && <div className="no-assessments">No sections yet — add one.</div>}
          </div>
        </div>

        <div className="editor-panel">
          {!selectedSection && <div>Select a section to edit</div>}
          {selectedSection && (
            <>
              <input className="section-title-input" value={selectedSection.title} onChange={e => updateSection(selectedSection.id, { title: e.target.value })} />
              <textarea className="section-description-input" value={selectedSection.description || ''} onChange={e => updateSection(selectedSection.id, { description: e.target.value })} />

              <div className="questions-header">
                <h4>Questions</h4>
                <div>
                  <select onChange={e => addQuestion(e.target.value)} defaultValue="short-text">
                    {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button className="button secondary" onClick={() => addQuestion()}>Add Question</button>
                </div>
              </div>

              <div className="questions-list">
                {selectedSection.questions.map(q => (
                  <div key={q.id} className={`question-item ${q.id === selectedQuestionId ? 'selected' : ''}`} onClick={() => setSelectedQuestionId(q.id)}>
                    <div>
                      <div style={{fontWeight:600}}>{q.text || 'Untitled question'}</div>
                      <div style={{fontSize:12, color:'#666'}}>{q.type}</div>
                    </div>
                    <div>
                      <button className="button secondary" onClick={(ev) => { ev.stopPropagation(); updateQuestion(q.id, { required: !q.required }); }}>
                        {q.required ? 'Req' : 'Opt'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedQuestion && (
                <div className="question-editor">
                  <input className="question-text-input" value={selectedQuestion.text} onChange={e => updateQuestion(selectedQuestion.id, { text: e.target.value })} />
                  <div className="question-type-selector">
                    <label>Type: </label>
                      <select value={selectedQuestion.type} onChange={e => {
                        const newType = e.target.value;
                        const curText = selectedQuestion.text || '';
                        const isDefault = !curText || curText === 'New question' || Object.values(TEXT_TEMPLATES).includes(curText);
                        const newText = isDefault ? (TEXT_TEMPLATES[newType] || curText) : curText;
                        updateQuestion(selectedQuestion.id, { type: newType, text: newText });
                      }}>
                        {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                  </div>

                  <label style={{display:'block', marginTop:8}}>
                    <input type="checkbox" checked={selectedQuestion.required} onChange={e => updateQuestion(selectedQuestion.id, { required: e.target.checked })} /> Required
                  </label>

                  {(selectedQuestion.type === 'single-choice' || selectedQuestion.type === 'multi-choice') && (
                    <div className="options-editor">
                      <h5>Options</h5>
                      {selectedQuestion.options.map((opt, idx) => (
                        <div key={idx} className="option-item">
                          <input value={opt} onChange={e => {
                            const newOptions = [...selectedQuestion.options]; newOptions[idx] = e.target.value; updateQuestion(selectedQuestion.id, { options: newOptions });
                          }} />
                          <button className="button secondary" onClick={() => updateQuestion(selectedQuestion.id, { options: selectedQuestion.options.filter((_,i)=>i!==idx) })}>Remove</button>
                        </div>
                      ))}
                      <button className="button secondary" onClick={() => updateQuestion(selectedQuestion.id, { options: [...(selectedQuestion.options||[]), ''] })}>Add Option</button>
                    </div>
                  )}

                  {selectedQuestion.type === 'numeric' && (
                    <div className="numeric-validation">
                      <input type="number" placeholder="Min" value={selectedQuestion.validation?.minValue ?? ''} onChange={e => updateQuestion(selectedQuestion.id, { validation: { ...selectedQuestion.validation, minValue: e.target.value ? Number(e.target.value) : null } })} />
                      <input type="number" placeholder="Max" value={selectedQuestion.validation?.maxValue ?? ''} onChange={e => updateQuestion(selectedQuestion.id, { validation: { ...selectedQuestion.validation, maxValue: e.target.value ? Number(e.target.value) : null } })} />
                    </div>
                  )}

                  {(selectedQuestion.type === 'short-text' || selectedQuestion.type === 'long-text') && (
                    <div className="text-validation">
                      <input type="number" placeholder="Max length" value={selectedQuestion.validation?.maxLength ?? ''} onChange={e => updateQuestion(selectedQuestion.id, { validation: { ...selectedQuestion.validation, maxLength: e.target.value ? Number(e.target.value) : null } })} />
                    </div>
                  )}

                  <div className="conditional-logic">
                    <h5>Conditional logic</h5>
                    <select value={selectedQuestion.conditionalRules?.dependsOn || ''} onChange={e => updateQuestion(selectedQuestion.id, { conditionalRules: { ...selectedQuestion.conditionalRules, dependsOn: e.target.value || null } })}>
                      <option value="">No condition</option>
                      {selectedSection.questions.filter(q=>q.id!==selectedQuestion.id).map(q => <option key={q.id} value={q.id}>{q.text || q.id}</option>)}
                    </select>
                    {selectedQuestion.conditionalRules?.dependsOn && (
                      <>
                        <select value={selectedQuestion.conditionalRules.showIf || 'equals'} onChange={e => updateQuestion(selectedQuestion.id, { conditionalRules: { ...selectedQuestion.conditionalRules, showIf: e.target.value } })}>
                          <option value="equals">equals</option>
                          <option value="not-equals">not equals</option>
                        </select>
                        <input value={selectedQuestion.conditionalRules?.value || ''} onChange={e => updateQuestion(selectedQuestion.id, { conditionalRules: { ...selectedQuestion.conditionalRules, value: e.target.value } })} placeholder="Value to compare" />
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="preview-panel">
          <h3>Live Preview</h3>
          <div className="preview-content">
            {selectedSection ? (
              <div className="preview-section">
                <h4>{selectedSection.title}</h4>
                <p>{selectedSection.description}</p>
                {selectedSection.questions.map(q => {
                  // evaluate conditional
                  const cond = q.conditionalRules;
                  if (cond && cond.dependsOn) {
                    const targetVal = previewAnswers[cond.dependsOn];
                    if (cond.showIf === 'equals' && String(targetVal) !== String(cond.value)) return null;
                    if (cond.showIf === 'not-equals' && String(targetVal) === String(cond.value)) return null;
                  }

                  return (
                    <div key={q.id} className="preview-question">
                      <label>{q.text}{q.required && <span className="required">*</span>}</label>
                      {q.type === 'short-text' && <input type="text" maxLength={q.validation?.maxLength||undefined} value={previewAnswers[q.id]||''} onChange={e=>onPreviewChange(q.id, e.target.value)} />}
                      {q.type === 'long-text' && <textarea maxLength={q.validation?.maxLength||undefined} value={previewAnswers[q.id]||''} onChange={e=>onPreviewChange(q.id, e.target.value)} />}
                      {q.type === 'single-choice' && (q.options||[]).map((opt, idx) => <label key={idx}><input type="radio" name={q.id} value={opt} checked={previewAnswers[q.id]===opt} onChange={e=>onPreviewChange(q.id, e.target.value)} /> {opt}</label>)}
                      {q.type === 'multi-choice' && (q.options||[]).map((opt, idx) => <label key={idx}><input type="checkbox" value={opt} checked={Array.isArray(previewAnswers[q.id]) && previewAnswers[q.id].includes(opt)} onChange={e=>{
                        const prev = previewAnswers[q.id] || [];
                        if (e.target.checked) onPreviewChange(q.id, [...prev, opt]); else onPreviewChange(q.id, prev.filter(x=>x!==opt));
                      }} /> {opt}</label>)}
                      {q.type === 'numeric' && <input type="number" min={q.validation?.minValue||undefined} max={q.validation?.maxValue||undefined} value={previewAnswers[q.id]||''} onChange={e=>onPreviewChange(q.id, e.target.value)} />}
                      {q.type === 'file-upload' && <input type="file" disabled />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-assessments">Select a section to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}