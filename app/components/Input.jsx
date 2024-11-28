// Input.jsx
import React from 'react';

export const Input = ({ type, name, value, onChange, placeholder, required }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  );
};
