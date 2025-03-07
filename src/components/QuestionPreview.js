import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './QuestionPreview.css';

const QuestionPreview = ({ questions, onReorder, onDelete }) => {
  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="options-container">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option">
                <input 
                  type="radio" 
                  name={`question-${question.id}`} 
                  id={`q${question.id}-o${optionIndex}`}
                />
                <label htmlFor={`q${question.id}-o${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        );

      case 'checkbox-list':
        return (
          <div className="options-container">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option">
                <input 
                  type="checkbox" 
                  id={`q${question.id}-o${optionIndex}`}
                />
                <label htmlFor={`q${question.id}-o${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        );

      case 'short-text':
        return (
          <input 
            type="text" 
            placeholder="Enter your answer" 
            id={`q${question.id}-text`}
          />
        );

      case 'long-text':
        return (
          <textarea 
            placeholder="Enter your answer" 
            rows="4" 
            id={`q${question.id}-textarea`}
          />
        );

      default:
        return null;
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div className="question-preview">
      <h2>Survey Preview</h2>
      {questions.length === 0 ? (
        <div className="no-questions">No questions added yet</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                className="questions-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={String(question.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`question-container ${
                          snapshot.isDragging ? 'dragging' : ''
                        }`}
                      >
                        <div className="question-header">
                          <div className="question-header-left">
                            <div
                              {...provided.dragHandleProps}
                              className="drag-handle"
                            >
                              ...
                            </div>
                            <h3>Question {index + 1}</h3>
                          </div>
                          <button
                            className="delete-button"
                            onClick={() => onDelete(index)}
                            aria-label="Delete question"
                          >
                            ×
                          </button>
                        </div>
                        <div className="question-text">{question.text}</div>
                        {renderQuestion(question, index)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default QuestionPreview; 