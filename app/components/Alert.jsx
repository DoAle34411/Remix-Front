// Alert.jsx
import React from 'react';

export const Alert = ({ children, variant = 'info', className }) => {
  const alertVariants = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    destructive: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`p-4 rounded-lg ${alertVariants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <p>{children}</p>;
};
