"use client";
import React, { useState } from "react";
import CompanyProgress from "./company-info";
// import { Progress } from "@react-three/drei";
import ProgressTab from "./tabs";

export default function TrackProgress() {
  const [initalized, setInitialized] = useState(true);
  return <div>{initalized ? <ProgressTab /> : <CompanyProgress />}</div>;
}
