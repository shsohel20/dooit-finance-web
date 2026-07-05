"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "./input";

const CustomSelect = dynamic(() => import("./CustomSelect"), { ssr: false });

const OTHER_VALUE = "__other__";

// Dropdown of common options plus an "Other" entry that reveals a free-text
// input. The bound form value stays a plain string, so existing string fields
// (and previously stored free-text values) keep working unchanged — a stored
// value that isn't in the options list automatically renders in "Other" mode.
const SelectWithOther = ({
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder = "Select...",
  otherPlaceholder = "Please specify",
}) => {
  const isPreset = !!value && options.includes(value);
  const [otherSelected, setOtherSelected] = useState(false);
  const showOther = otherSelected || (!!value && !isPreset);

  const selectOptions = useMemo(
    () => [
      ...options.map((option) => ({ value: option, label: option })),
      { value: OTHER_VALUE, label: "Other" },
    ],
    [options],
  );

  const selectValue = showOther
    ? { value: OTHER_VALUE, label: "Other" }
    : isPreset
      ? { value, label: value }
      : null;

  const handleSelect = (option) => {
    if (option?.value === OTHER_VALUE) {
      setOtherSelected(true);
      if (isPreset) onChange("");
    } else {
      setOtherSelected(false);
      onChange(option?.value ?? "");
    }
  };

  return (
    <div className="w-full space-y-2">
      <CustomSelect
        label={label}
        options={selectOptions}
        value={selectValue}
        placeholder={placeholder}
        onChange={handleSelect}
        isClearable
        error={!showOther ? error : undefined}
      />
      {showOther && (
        <Input
          value={value || ""}
          placeholder={otherPlaceholder}
          onChange={(event) => onChange(event.target.value)}
          error={error}
        />
      )}
    </div>
  );
};

export default SelectWithOther;
