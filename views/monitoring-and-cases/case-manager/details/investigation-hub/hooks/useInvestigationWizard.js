"use client";

import { useMemo, useState } from "react";
import {
  INVESTIGATION_STEPS,
  DEFAULT_STEP_DONE,
  DEFAULT_CHECKLIST,
  SMR_PART_ORDER,
} from "../data/investigationHubData";

function seedPois(caseData) {
  const individuals = caseData?.relationships?.individuals || [];
  const connected = caseData?.connectedCustomers || [];
  const priorReports = (caseData?.previousSARs || []).map((s) => ({
    id: s.id,
    date: new Date(s.filedDate).toLocaleDateString("en-AU", { month: "2-digit", year: "numeric" }),
  }));

  const fromIndividuals = individuals.map((p, i) => ({
    id: `poi-ind-${i}`,
    name: p.name,
    meta: `${p.relationship} · related individual`,
    role: i === 0 ? "Primary subject" : "Associated party",
    color: i === 0 ? "#c0392b" : "#4340a0",
    ecdds: [],
    reports: i === 0 ? priorReports : [],
  }));

  const fromConnected = connected.map((p, i) => ({
    id: `poi-conn-${i}`,
    name: p.name,
    meta: `${p.relationship} · connected customer`,
    role: "Associated party",
    color: "#4340a0",
    ecdds: [],
    reports: [],
  }));

  return [...fromIndividuals, ...fromConnected];
}

function seedCaseAlerts(caseData) {
  const primary = {
    id: caseData?.uid || "AL-PRIMARY",
    title: caseData?.title || caseData?.caseName || "Primary alert",
    date: caseData?.createdDate
      ? new Date(caseData.createdDate).toLocaleDateString("en-AU")
      : "—",
  };
  const duplicates = (caseData?.duplicateAlerts || []).map((d) => ({
    id: d.alertId,
    title: d.detectionRule,
    date: new Date(d.date).toLocaleDateString("en-AU"),
  }));
  return [primary, ...duplicates];
}

/**
 * Owns all state and mutation logic for the Investigation Hub wizard: the
 * active step, per-step selections, the persons-of-interest list, custom
 * typologies/reasons, the AUSTRAC SMR part, and the investigation checklist.
 * Ported from the AML Case Workspace prototype's Component state machine.
 */
export function useInvestigationWizard(caseData) {
  const [activeStep, setActiveStep] = useState(6); // land on Narrative, mirroring the prototype
  const [narrativeTpl, setNarrativeTpl] = useState("ecdd");
  const [smrPart, setSmrPart] = useState("A");
  const [typoDraft, setTypoDraft] = useState("");
  const [reasonDraft, setReasonDraft] = useState("");
  const [customTypologies, setCustomTypologies] = useState([]);
  const [customReasons, setCustomReasons] = useState([]);
  const [stepsDone, setStepsDone] = useState(DEFAULT_STEP_DONE);
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [pois, setPois] = useState(() => seedPois(caseData));
  const [sel, setSel] = useState({
    services: [],
    reasons: [],
    provided: "",
  });

  const caseAlerts = useMemo(() => seedCaseAlerts(caseData), [caseData]);

  const steps = useMemo(
    () => INVESTIGATION_STEPS.map((s, i) => ({ ...s, done: stepsDone[i] })),
    [stepsDone],
  );

  const markDone = (i) =>
    setStepsDone((prev) => {
      if (prev[i]) return prev;
      const next = prev.slice();
      next[i] = true;
      return next;
    });

  const setRadio = (key, opt) => {
    setSel((prev) => ({ ...prev, [key]: opt }));
    if (typeof key === "number") markDone(key);
  };

  const toggleMulti = (key, opt) => {
    setSel((prev) => {
      const cur = Array.isArray(prev[key]) ? prev[key].slice() : [];
      const idx = cur.indexOf(opt);
      if (idx >= 0) cur.splice(idx, 1);
      else cur.push(opt);
      return { ...prev, [key]: cur };
    });
    if (typeof key === "number") markDone(key);
  };

  const addTypology = () => {
    const v = typoDraft.trim();
    if (!v) return;
    setCustomTypologies((prev) => [...prev, v]);
    setSel((prev) => ({ ...prev, 7: [...(prev[7] || []), v] }));
    setTypoDraft("");
    markDone(7);
  };

  const addReason = () => {
    const v = reasonDraft.trim();
    if (!v) return;
    setCustomReasons((prev) => [...prev, v]);
    setSel((prev) => ({ ...prev, reasons: [...(prev.reasons || []), v] }));
    setReasonDraft("");
  };

  const removePoi = (id) => setPois((prev) => prev.filter((p) => p.id !== id));

  const addPoi = (poi) => setPois((prev) => [...prev, poi]);

  const toggleCheck = (i) =>
    setChecklist((prev) => {
      const next = prev.slice();
      next[i] = { ...next[i], checked: !next[i].checked };
      return next;
    });

  const goToStep = (i) => setActiveStep(Math.max(0, Math.min(steps.length - 1, i)));
  const goPrev = () => goToStep(activeStep - 1);
  const goNext = () => {
    markDone(activeStep);
    goToStep(activeStep + 1);
  };

  const smrGo = (dir) => {
    const idx = SMR_PART_ORDER.indexOf(smrPart);
    const next = Math.max(0, Math.min(SMR_PART_ORDER.length - 1, idx + dir));
    setSmrPart(SMR_PART_ORDER[next]);
    if (dir > 0 && idx === SMR_PART_ORDER.length - 1) markDone(activeStep);
  };

  const doneCount = stepsDone.filter(Boolean).length;
  const checkedCount = checklist.filter((c) => c.checked).length;

  return {
    steps,
    activeStep,
    doneCount,
    goToStep,
    goPrev,
    goNext,

    checklist,
    checkedCount,
    toggleCheck,

    narrativeTpl,
    setNarrativeTpl,

    smrPart,
    setSmrPart,
    smrGo,

    sel,
    setRadio,
    toggleMulti,

    typoDraft,
    setTypoDraft,
    addTypology,
    customTypologies,

    reasonDraft,
    setReasonDraft,
    addReason,
    customReasons,

    pois,
    removePoi,
    addPoi,
    caseAlerts,
  };
}
