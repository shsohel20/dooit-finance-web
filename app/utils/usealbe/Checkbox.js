import React from "react";
import { cn } from "../utility";

// Reusable Checkbox Component
const Checkbox = ({
  label,
  checked,
  onChange,
  required = false,
  error = "",
  className = "",
  ...props
}) => {
  const checkboxClasses = cn(
    "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
    error ? "border-red-500" : "",
    className,
  );

  return (
    <div className="space-y-1">
      <label className="flex items-start">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          className={checkboxClasses}
          {...props}
        />
        <span className="ml-2 text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {error && <p className="text-red-500 text-sm mt-1 ml-6">{error}</p>}
    </div>
  );
};
export default Checkbox;
