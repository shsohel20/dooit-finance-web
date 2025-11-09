import React from "react";
import { cn } from "../utility";

// Reusable Select Component
const Select = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
  error = "",
  className = "",
  ...props
}) => {
  const selectClasses = cn(
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
    error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
    className,
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
