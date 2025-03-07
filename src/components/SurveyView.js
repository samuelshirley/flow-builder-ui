import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SurveyView.css';

const SurveyView = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        console.log('Fetching survey with ID:', surveyId);
        const response = await fetch(`http://localhost:3001/surveys/${surveyId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch survey');
        }
        
        const data = await response.json();
        console.log('Received survey data:', data);
        setSurvey(data);
      } catch (err) {
        console.error('Error fetching survey:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchSurvey();
    }
  }, [surveyId]);

  if (loading) {
    return <div className="survey-view-loading">Loading survey...</div>;
  }

  if (error) {
    return <div className="survey-view-error">Error: {error}</div>;
  }

  if (!survey) {
    return <div className="survey-view-error">Survey not found</div>;
  }

  return (
    <div className="survey-view">
      <div className="survey-header">
        <h1>{survey.title}</h1>
        {survey.description && (
          <p className="survey-description">{survey.description}</p>
        )}
      </div>
      <div className="survey-questions">
        {survey.questions.map((question, index) => (
          <div key={question.id} className="question-container">
            <div className="question-text">
              {index + 1}. {question.text}
              {question.required && <span className="required">*</span>}
            </div>
            <div className="question-input">
              {question.type === 'multiple-choice' && (
                <div className="options-list">
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="option-label">
                      <input type="radio" name={`question-${question.id}`} />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              {question.type === 'checkbox-list' && (
                <div className="options-list">
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="option-label">
                      <input type="checkbox" name={`question-${question.id}`} />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              {question.type === 'short-text' && (
                <input type="text" className="text-input" />
              )}
              {question.type === 'long-text' && (
                <textarea className="text-area" rows="4" />
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="submit-survey-button">Submit Survey</button>
    </div>
  );
};

export default SurveyView; 