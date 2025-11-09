"use client";

import React from "react";
import Select from "react-select";
import { Label } from "./label";

const CustomSelect = ({ label, ...props }) => {
  return (
    <div className="w-full">
      {label && <Label>{label}</Label>}
      <Select {...props} classNamePrefix="react-select" />
    </div>
  );
};

export default CustomSelect;
