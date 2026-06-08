"use client";
import React, { useState } from "react";
import CompanyProgress from "./company-info";
// import { Progress } from "@react-three/drei";
import ProgressTab from "./tabs";

export default function TrackProgress() {
  const [initalized, setInitialized] = useState(false);
  return (
    <div>{initalized ? <ProgressTab /> : <CompanyProgress setInitialized={setInitialized} />}</div>
  );
}
