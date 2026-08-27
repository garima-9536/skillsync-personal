import React from 'react';
import { BsInbox } from 'react-icons/bs';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <BsInbox className="text-6xl text-slate-300 dark:text-slate-600 mb-4" />
    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    {description && <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{description}</p>}
    {actionLabel && onAction && (
      <button className="btn-secondary btn-sm" onClick={onAction}>{actionLabel}</button>
    )}
  </div>
);

export default EmptyState;
