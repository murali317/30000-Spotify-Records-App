import React from "react";

interface RowCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

const RowCheckbox: React.FC<RowCheckboxProps> = ({ checked, onChange, ariaLabel }) => (
  <input
    type="checkbox"
    className="form-checkbox h-4 w-4 text-blue-600 align-middle"
    checked={checked}
    onChange={e => onChange(e.target.checked)}
    aria-label={ariaLabel}
  />
);

export default RowCheckbox;
