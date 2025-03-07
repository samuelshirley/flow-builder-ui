import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  fullWidth = false,
  type = 'button',
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${variant} ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 