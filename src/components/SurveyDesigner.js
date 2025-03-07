import React, { useState } from 'react';
import QuestionDesigner from './QuestionDesigner';
import Button from './Button';
import './SurveyDesigner.css';

const SurveyDesigner = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [savedSurveyId, setSavedSurveyId] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/surveys', {
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
        throw new Error('Failed to save survey');
      }

      const data = await response.json();
      setSavedSurveyId(data.surveyId);
      setSaveStatus({ type: 'success', message: 'Survey saved successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="survey-designer">
      <h1>Survey Designer</h1>
      <div className="survey-designer-container">
        <div className="designer-section">
          <div className="survey-info">
            <input
              type="text"
              className="survey-title-input"
              placeholder="Survey Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="survey-description-input"
              placeholder="Survey Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <QuestionDesigner onSubmit={handleAddQuestion} />

          <div className="save-section">
            <Button
              onClick={handleSave}
              disabled={!title.trim() || questions.length === 0}
              fullWidth
            >
              Save Survey
            </Button>

            {saveStatus && (
              <div className={`save-status ${saveStatus.type}`}>
                {saveStatus.message}
              </div>
            )}

            {savedSurveyId && (
              <div className="survey-link">
                <a href={`/surveys/${savedSurveyId}`} target="_blank" rel="noopener noreferrer">
                  View Survey
                </a>
              </div>
            )}
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

export default SurveyDesigner; 