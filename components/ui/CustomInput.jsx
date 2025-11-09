"use client";
import React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

const CustomInput = ({ label, type = "text", ...props }) => {
  return (
    <div className="w-full">
      <Label className={""}>{label}</Label>
      {type === "textarea" ? (
        <Textarea {...props} />
      ) : (
        <Input type={type} {...props} />
      )}
    </div>
  );
};

export default CustomInput;
