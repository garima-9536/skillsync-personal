import React from 'react';

const LoadingSpinner = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3">
    <div className="spinner" />
    {message && <p className="text-slate-500 text-sm">{message}</p>}
  </div>
);

export default LoadingSpinner;
