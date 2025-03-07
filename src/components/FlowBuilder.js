import React, { useState } from 'react';
import QuestionDesigner from './QuestionDesigner';
import Button from './Button';
import './FlowBuilder.css';

const FlowBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [savedFlowId, setSavedFlowId] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save flow');
      }

      const data = await response.json();
      setSavedFlowId(data.consultationId);
      setSaveStatus({ type: 'success', message: 'Flow saved successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="flow-builder">
      <h1>Flow Builder</h1>
      <div className="flow-builder-container">
        <div className="designer-section">
          <div className="save-section">
            <Button
              onClick={handleSave}
              disabled={!title.trim() || questions.length === 0}
              fullWidth
            >
              Save Flow
            </Button>

            {saveStatus && (
              <div className={`save-status ${saveStatus.type}`}>
                {saveStatus.message}
              </div>
            )}

            {savedFlowId && (
              <div className="flow-link">
                <a href={`http://localhost:5001/flow/${savedFlowId}`} target="_blank" rel="noopener noreferrer">
                  View Flow
                </a>
              </div>
            )}
          </div>

          <div className="flow-info-card">
            <input
              type="text"
              className="flow-title-input"
              placeholder="Flow Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="flow-description-input"
              placeholder="Flow Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="question-designer-card">
            <QuestionDesigner onSubmit={handleAddQuestion} />
          </div>
        </div>

        <div className="preview-section">
          <h2>Preview</h2>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
          {questions.map((question, index) => (
            <div key={index} className="preview-question">
              <p>{question.text}</p>
              {question.type !== 'text' && (
                <div className="preview-options">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="preview-option">
                      {question.type === 'single' ? (
                        <input type="radio" name={`question-${index}`} />
                      ) : (
                        <input type="checkbox" />
                      )}
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder; 