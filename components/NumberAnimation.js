'use client';

import NumberFlow, { continuous } from "@number-flow/react";
import { useEffect, useState } from "react";

export default function NumberAnimation({ value }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return <NumberFlow value={currentValue} plugins={[continuous]} isolate />;
}