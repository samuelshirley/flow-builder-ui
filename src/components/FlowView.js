import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FlowView.css';

const FlowView = () => {
  const { consultationId } = useParams();
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        console.log('Fetching flow with ID:', consultationId);
        const response = await fetch(`http://localhost:3001/consultations/${consultationId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch flow');
        }
        
        const data = await response.json();
        console.log('Received flow data:', data);
        setFlow(data);
      } catch (err) {
        console.error('Error fetching flow:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchFlow();
    }
  }, [consultationId]);

  if (loading) {
    return <div className="flow-view-loading">Loading flow...</div>;
  }

  if (error) {
    return <div className="flow-view-error">Error: {error}</div>;
  }

  if (!flow) {
    return <div className="flow-view-error">Flow not found</div>;
  }

  return (
    <div className="flow-view">
      <div className="flow-header">
        <h1>{flow.title}</h1>
        {flow.description && (
          <p className="flow-description">{flow.description}</p>
        )}
      </div>
      <div className="flow-questions">
        {flow.questions.map((question, index) => (
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
      <button className="submit-flow-button">Submit Flow</button>
    </div>
  );
};

export default FlowView; 