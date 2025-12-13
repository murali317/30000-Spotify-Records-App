import React, { useState, useEffect } from 'react';

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ value, onChange }) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(input);
    }, 300);
    return () => clearTimeout(handler);
  }, [input, onChange]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        className={`border rounded px-3 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${value ? 'bg-blue-50' : ''}`}
        type="text"
        placeholder="Search all columns..."
        value={input}
        onChange={e => setInput(e.target.value)}
        aria-label="Global search"
      />
      {value && (
        <button
          className="text-xs text-gray-500 hover:text-red-500 px-2"
          onClick={() => setInput('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default GlobalSearch;
