import React from 'react';

interface SortableHeaderProps {
  label: string;
  column: any;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, column }) => {
  const isSorted = column?.getIsSorted();
  const isActive = isSorted === 'asc' || isSorted === 'desc';
  return (
    <button
      type="button"
      className={`flex items-center gap-1 group select-none px-1 py-0.5 rounded transition-colors duration-150 ${isActive ? 'bg-blue-100' : ''}`}
      onClick={() => column?.toggleSorting(isSorted === 'asc')}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span className="flex flex-col ml-1">
        <svg width="10" height="10" className={`mx-auto ${isSorted === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 10 10"><path d="M5 2L2 6h6L5 2z"/></svg>
        <svg width="10" height="10" className={`mx-auto ${isSorted === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 10 10"><path d="M5 8l3-4H2l3 4z"/></svg>
      </span>
    </button>
  );
};

export default SortableHeader;
