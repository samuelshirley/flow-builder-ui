import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSurveys, deleteSurvey } from '../services/api';
import { auth } from '../firebase';
import Button from './Button';
import './SavedSurveys.css';

const SavedSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  const fetchSurveys = async () => {
    try {
      const data = await getUserSurveys();
      setSurveys(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchSurveys();
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (surveyId) => {
    try {
      await deleteSurvey(surveyId);
      setSurveys(surveys.filter(survey => survey.surveyId !== surveyId));
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (survey) => {
    navigate(`/edit-survey/${survey.surveyId}`, { state: { survey } });
  };

  if (loading) {
    return <div className="saved-surveys-loading">Loading your surveys...</div>;
  }

  if (error) {
    return <div className="saved-surveys-error">Error: {error}</div>;
  }

  return (
    <div className="saved-surveys">
      <h1>Your Surveys</h1>
      {surveys.length === 0 ? (
        <div className="no-surveys">
          <p>You haven't created any surveys yet.</p>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="create-survey-link"
          >
            Create Your First Survey
          </Button>
        </div>
      ) : (
        <div className="surveys-grid">
          {surveys.map((survey) => (
            <div key={survey.surveyId} className="survey-card">
              <h2>{survey.title}</h2>
              {survey.description && (
                <p className="survey-description">{survey.description}</p>
              )}
              <div className="survey-meta">
                <span className="survey-date">
                  Created: {new Date(survey.createdAt).toLocaleDateString()}
                </span>
                <span className="survey-questions">
                  {survey.questions?.length || 0} questions
                </span>
              </div>
              <div className="survey-actions">
                <div className="action-buttons">
                  <Button
                    onClick={() => navigate(`/surveys/${survey.surveyId}`)}
                    variant="primary"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleEdit(survey)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  {deleteConfirmId === survey.surveyId ? (
                    <div className="delete-confirmation">
                      <Button
                        onClick={() => handleDelete(survey.surveyId)}
                        variant="primary"
                        className="confirm-delete-button"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirmId(null)}
                        variant="secondary"
                        className="cancel-delete-button"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setDeleteConfirmId(survey.surveyId)}
                      variant="secondary"
                      className="delete-survey-button"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSurveys; 