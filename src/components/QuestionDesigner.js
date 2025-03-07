import React, { useState } from 'react';
import Button from './Button';
import './QuestionDesigner.css';

const QuestionDesigner = ({ onSubmit }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('short-text');
  const [options, setOptions] = useState(['']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = {
      text: questionText,
      type: questionType,
      options: (questionType === 'multiple-choice' || questionType === 'checkbox-list') ? options.filter(option => option.trim() !== '') : []
    };
    onSubmit(question);
    setQuestionText('');
    setQuestionType('short-text');
    setOptions(['']);
  };

  const canAddOption = options.some(option => option.trim() !== '') && options.length < 10;

  return (
    <div className="question-designer">
      <h2>New Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question-type">Question Type</label>
          <select
            id="question-type"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            required
          >
            <option value="short-text">Short Text</option>
            <option value="long-text">Long Text</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="checkbox-list">Checkbox List</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="question-text">Question Text</label>
          <input
            type="text"
            id="question-text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>

        {(questionType === 'multiple-choice' || questionType === 'checkbox-list') && (
          <div className="options-section">
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <Button
                  variant="secondary"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="dashed"
              onClick={addOption}
              disabled={!canAddOption || options.length >= 10}
              fullWidth
            >
              Add Option
            </Button>
          </div>
        )}

        <Button type="submit" fullWidth>
          Add Question to Survey
        </Button>
      </form>
    </div>
  );
};

export default QuestionDesigner; 