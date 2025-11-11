"use client";

import React from "react";
import Select from "react-select";
import { Label } from "./label";
import { cn } from "@/lib/utils";

const CustomSelect = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <Select
        aria-invalid={error ? true : false}
        classNamePrefix="react-select"
        {...props}
      />
      {error && (
        <p className="text-red-600 font-semibold text-sm mt-0.5">
          This field is required
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
