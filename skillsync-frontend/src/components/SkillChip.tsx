import React from 'react';
import { IoClose } from 'react-icons/io5';

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Frontend: { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' },
  Backend:  { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  Mobile:   { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  DevOps:   { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
  Design:   { bg: '#fdf2f8', text: '#db2777', border: '#f9a8d4' },
  Data:     { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  Other:    { bg: '#f8fafc', text: '#6b7280', border: '#e2e8f0' },
};

interface SkillChipProps {
  name: string;
  category?: string;
  proficiency?: string;
  size?: 'small' | 'medium';
  onDelete?: () => void;
}

const SkillChip = ({ name, category = 'Other', proficiency, size = 'small', onDelete }: SkillChipProps) => {
  const { bg, text, border } = categoryColors[category] || categoryColors.Other;
  const label = proficiency ? `${name} · ${proficiency.charAt(0) + proficiency.slice(1).toLowerCase()}` : name;
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg font-semibold border ${size === 'small' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'}`}
      style={{ backgroundColor: bg, color: text, borderColor: border }}>
      {label}
      {onDelete && (
        <button type="button" onClick={onDelete} className="ml-0.5 hover:opacity-70 transition-opacity" style={{ color: text }}>
          <IoClose className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default SkillChip;
