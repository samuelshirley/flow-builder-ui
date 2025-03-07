import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConsultations, deleteConsultation } from '../services/api';
import { auth } from '../firebase';
import Button from './Button';
import './Flows.css';

const Flows = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  const fetchFlows = async () => {
    try {
      const data = await getUserConsultations();
      setFlows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchFlows();
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (flowId) => {
    try {
      await deleteConsultation(flowId);
      setFlows(flows.filter(flow => flow.consultationId !== flowId));
      setDeleteConfirmId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (flow) => {
    navigate(`/edit-flow/${flow.consultationId}`, { state: { flow } });
  };

  if (loading) {
    return <div className="flows-loading">Loading your flows...</div>;
  }

  if (error) {
    return <div className="flows-error">Error: {error}</div>;
  }

  return (
    <div className="flows">
      <h1>Your Flows</h1>
      {flows.length === 0 ? (
        <div className="no-flows">
          <p>You haven't created any flows yet.</p>
          <Button
            onClick={() => navigate('/flow-builder')}
            variant="primary"
            className="create-flow-link"
          >
            Create Your First Flow
          </Button>
        </div>
      ) : (
        <div className="flows-grid">
          {flows.map((flow) => (
            <div key={flow.consultationId} className="flow-card">
              <h2>{flow.title}</h2>
              {flow.description && (
                <p className="flow-description">{flow.description}</p>
              )}
              <div className="flow-meta">
                <span className="flow-date">
                  Created: {new Date(flow.createdAt).toLocaleDateString()}
                </span>
                <span className="flow-questions">
                  {flow.questions?.length || 0} questions
                </span>
              </div>
              <div className="flow-actions">
                <div className="action-buttons">
                  <Button
                    onClick={() => window.open(`http://localhost:5000/flow/${flow.consultationId}`, '_blank')}
                    variant="primary"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleEdit(flow)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  {deleteConfirmId === flow.consultationId ? (
                    <div className="delete-confirmation">
                      <Button
                        onClick={() => handleDelete(flow.consultationId)}
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
                      onClick={() => setDeleteConfirmId(flow.consultationId)}
                      variant="secondary"
                      className="delete-flow-button"
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

export default Flows;