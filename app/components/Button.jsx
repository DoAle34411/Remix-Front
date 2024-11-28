// Button.jsx
import React from 'react';

export const Button = ({ onClick, children, className, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};