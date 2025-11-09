import React from "react";
import { cn } from "../utility";

const Section = ({ title, children, className = "", ...props }) => {
  return (
    <div className={cn("border-t border-gray-200 pt-6", className)} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Section;
