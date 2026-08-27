import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationControlProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl = ({ page, totalPages, onPageChange }: PaginationControlProps) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button className="btn btn-secondary btn-sm px-2 disabled:opacity-40" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        <FiChevronLeft />
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p - 1)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${p - 1 === page ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'}`}>
          {p}
        </button>
      ))}
      <button className="btn btn-secondary btn-sm px-2 disabled:opacity-40" disabled={page === totalPages - 1} onClick={() => onPageChange(page + 1)}>
        <FiChevronRight />
      </button>
    </div>
  );
};

export default PaginationControl;
