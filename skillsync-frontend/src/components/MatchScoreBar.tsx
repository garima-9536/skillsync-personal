import React from 'react';

interface MatchScoreBarProps {
  score: number;
  showLabel?: boolean;
}

const MatchScoreBar = ({ score, showLabel = true }: MatchScoreBarProps) => {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-500';
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500">Match Score</span>
          <span className={`text-xs font-bold ${textColor}`}>{score}%</span>
        </div>
      )}
      <div className="progress-bar h-2">
        <div className={`progress-fill ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

export default MatchScoreBar;
