import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import QuestionDesigner from './QuestionDesigner';
import QuestionPreview from './QuestionPreview';
import { updateConsultation } from '../services/api';
import './FlowBuilder.css';

const EditFlow = () => {
  const { consultationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (location.state?.flow) {
      const { flow } = location.state;
      setTitle(flow.title);
      setDescription(flow.description || '');
      setQuestions(flow.questions || []);
    }
  }, [location.state]);

  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const handleReorderQuestions = (reorderedQuestions) => {
    setQuestions(reorderedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const validateFlow = () => {
    const errors = [];

    // Validate title
    if (!title.trim()) {
      errors.push('Please enter a flow title');
    }

    // Validate questions array
    if (questions.length === 0) {
      errors.push('Please add at least one question to your flow');
    } else {
      // Validate each question
      questions.forEach((question, index) => {
        // Check question text
        if (!question.text?.trim()) {
          errors.push(`Question ${index + 1} is missing text`);
        }

        // Check options for multiple choice and checkbox questions
        if ((question.type === 'multiple-choice' || question.type === 'checkbox-list') && 
            (!question.options || question.options.length === 0 || question.options.some(opt => !opt.trim()))) {
          errors.push(`Question ${index + 1} is missing options`);
        }
      });
    }

    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateFlow();
    
    if (validationErrors.length > 0) {
      setSaveStatus({ 
        type: 'error', 
        message: validationErrors.join('. ') 
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const flowData = {
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q, index) => ({
          ...q,
          order: index,
          text: q.text.trim(),
          options: q.options?.map(opt => opt.trim()) || []
        }))
      };

      await updateConsultation(consultationId, flowData);
      setSaveStatus({ 
        type: 'success', 
        message: 'Flow updated successfully!' 
      });
      setTimeout(() => {
        navigate('/my-flows');
      }, 1500);
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flow-builder">
      <h1>Edit Flow</h1>
      <div className="flow-builder-container">
        <div className="designer-section">
          <div className="flow-info">
            <input
              type="text"
              placeholder="Flow Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flow-title-input"
            />
            <textarea
              placeholder="Flow Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flow-description-input"
            />
          </div>
          <QuestionDesigner onAddQuestion={handleAddQuestion} />
        </div>
        <div className="preview-section">
          <QuestionPreview 
            questions={questions} 
            onReorder={handleReorderQuestions}
            onDelete={handleDeleteQuestion}
          />
          <div className="save-section">
            <button 
              onClick={handleSave}
              disabled={isSaving || questions.length === 0}
              className="save-flow-button"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            {saveStatus && (
              <div className={`save-status ${saveStatus.type}`}>
                {saveStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFlow; 