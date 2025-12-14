import React from "react";

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <span className="text-red-500 text-sm font-semibold">Error: {message}</span>
  </div>
);

export default ErrorMessage;
