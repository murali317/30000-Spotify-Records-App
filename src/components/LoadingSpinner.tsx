import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
    <span className="text-gray-500 text-sm">Loading tracks...</span>
  </div>
);

export default LoadingSpinner;
