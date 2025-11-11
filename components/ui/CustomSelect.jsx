"use client";

import React from "react";
import Select from "react-select";
import { Label } from "./label";

const CustomSelect = ({ label, ...props }) => {
  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <Select classNamePrefix="react-select" {...props} />
    </div>
  );
};

export default CustomSelect;
