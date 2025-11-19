import React from "react";
import { cn } from "../utility";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  className = "",
  icon,
  ...props
}) => {
  const inputClasses = cn(
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ",
    error ? "border-red-500" : "",
    icon && "pl-10",
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
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
