"use client";

import React from "react";
const Select = dynamic(
  () => import("react-select"),
  { ssr: false } // This line is crucial
);
import { Label } from "./label";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "var(--accent)", // for option hover bg-color
    primary: "var(--primary)", // for selected option bg-color
    neutral10: "var(--primary)", // for tags bg-color
    neutral20: "var(--border)", // for input border-color
    neutral30: "var(--border)", // for input hover border-color
  },
});

const CustomSelect = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <Select
        aria-invalid={error ? true : false}
        classNamePrefix="react-select"
        className={cn(
          "dropdown-select border border-transparent !rounded-lg     transition-colors",
          {
            "border-red-500": error,
          }
        )}
        // menuPortalTarget={document.body}
        menuPlacement="auto"
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: "9999",
          }),
        }}
        theme={selectThemeColors}
        {...props}
      />
      {error && (
        <p className="text-red-500   text-xs mt-0.5">This field is required</p>
      )}
    </div>
  );
};

export default CustomSelect;
