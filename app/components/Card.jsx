// Card.jsx
import React from 'react';

export const Card = ({ className, children }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => {
  return <div className="border-b pb-4">{children}</div>;
};

export const CardTitle = ({ className, children }) => {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children }) => {
  return <div className="pt-4">{children}</div>;
};
