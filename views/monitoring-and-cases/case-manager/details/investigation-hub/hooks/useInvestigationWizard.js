"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  INVESTIGATION_STEPS,
  DEFAULT_CHECKLIST,
  SMR_PART_ORDER,
} from "../data/investigationHubData";
import {
  getCaseInvestigation,
  saveCaseInvestigation,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";

// Nothing is done until someone does it. The hub used to seed six of the twelve
// steps as complete, so every case opened at "6/12 · 50%" before an analyst had
// looked at it (docs/70 §3, docs/74 C18).
const NO_STEPS_DONE = INVESTIGATION_STEPS.map(() => false);

// How long the analyst has to stop typing before their work is written. Long
// enough not to save on every keystroke, short enough that closing the tab a
// couple of seconds later still keeps the answer.
const AUTOSAVE_DELAY_MS = 1500;

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
export function useInvestigationWizard(caseData, caseId) {
  const [activeStep, setActiveStep] = useState(0); // start at Triage, not mid-way
  const [narrativeTpl, setNarrativeTpl] = useState("ecdd");
  const [smrPart, setSmrPart] = useState("A");
  const [typoDraft, setTypoDraft] = useState("");
  const [reasonDraft, setReasonDraft] = useState("");
  const [customTypologies, setCustomTypologies] = useState([]);
  const [customReasons, setCustomReasons] = useState([]);
  const [stepsDone, setStepsDone] = useState(NO_STEPS_DONE);
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [pois, setPois] = useState(() => seedPois(caseData));
  const [sel, setSel] = useState({
    services: [],
    reasons: [],
    provided: "",
  });

  // ── Persistence (docs/74 C18) ─────────────────────────────────────────────
  // `loaded` gates the autosave: without it the empty initial state would be
  // written over the analyst's saved work the moment the hub mounted.
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState({ saving: false, savedAt: null, error: null });
  const saveTimer = useRef(null);
  const latest = useRef(null);

  useEffect(() => {
    if (!caseId) {
      setLoaded(true); // nothing to load against; the hub still works in-memory
      return;
    }
    let cancelled = false;

    getCaseInvestigation(caseId)
      .then((res) => {
        if (cancelled) return;
        const saved = res?.succeed ? res.data : null;
        if (saved) {
          // Only restore what was actually stored — a field the analyst never
          // touched keeps its default rather than becoming null.
          if (typeof saved.activeStep === "number") setActiveStep(saved.activeStep);
          if (saved.stepsDone?.length) setStepsDone(saved.stepsDone);
          if (saved.checklist?.length) setChecklist(saved.checklist);
          if (saved.selections) setSel((prev) => ({ ...prev, ...saved.selections }));
          if (saved.pois?.length) setPois(saved.pois);
          if (saved.customTypologies?.length) setCustomTypologies(saved.customTypologies);
          if (saved.customReasons?.length) setCustomReasons(saved.customReasons);
          if (saved.narrativeTemplate) setNarrativeTpl(saved.narrativeTemplate);
          if (saved.smr?.part) setSmrPart(saved.smr.part);
          setSaveState({ saving: false, savedAt: saved.updatedAt || null, error: null });
        }
      })
      .catch(() => {
        // A failed load must not wipe anything: stay on defaults and let the
        // analyst work, but do not autosave over what may exist on the server.
        if (!cancelled) setSaveState({ saving: false, savedAt: null, error: "load" });
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  // Write the analyst's work, debounced. Kept in a ref so the timer always
  // sends the newest state rather than the state captured when it was set.
  latest.current = {
    activeStep,
    stepsDone,
    checklist,
    selections: sel,
    pois,
    customTypologies,
    customReasons,
    narrativeTemplate: narrativeTpl,
    smr: { part: smrPart },
  };

  const flush = useCallback(async () => {
    if (!caseId) return;
    setSaveState((s) => ({ ...s, saving: true }));
    try {
      const res = await saveCaseInvestigation(caseId, latest.current);
      setSaveState({
        saving: false,
        savedAt: res?.succeed ? res.data?.updatedAt || new Date().toISOString() : null,
        error: res?.succeed ? null : "save",
      });
    } catch {
      setSaveState({ saving: false, savedAt: null, error: "save" });
    }
  }, [caseId]);

  useEffect(() => {
    // Never autosave before the load has settled, and never when the load
    // itself failed — either would risk overwriting stored progress.
    if (!loaded || !caseId || saveState.error === "load") return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(saveTimer.current);
    // The dependency list is the analyst's work: any change schedules a save.
  }, [
    loaded, caseId, flush, saveState.error,
    activeStep, stepsDone, checklist, sel, pois, customTypologies, customReasons,
    narrativeTpl, smrPart,
  ]);

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

    // Persistence, for the hub header's "Saving… / Saved" indicator.
    loaded,
    saving: saveState.saving,
    savedAt: saveState.savedAt,
    saveError: saveState.error,
    saveNow: flush,
  };
}
