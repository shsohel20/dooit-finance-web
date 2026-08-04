"use client";

import { useState } from "react";
import { IconFlag, IconPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PoiCard from "./PoiCard";

export default function PoiStep({ wizard }) {
  const { pois, removePoi, addPoi, caseAlerts } = wizard;
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Associated party");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addPoi({
      id: `poi-${Date.now()}`,
      name: trimmed,
      meta: "Manually added · associated party",
      role,
      color: "#4340a0",
      ecdds: [],
      reports: [],
    });
    setName("");
    setRole("Associated party");
    setAdding(false);
  };

  return (
    <div className="max-w-[720px]">
      <div className="mb-4.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-amber-800">
          <IconFlag className="size-3.5" />
          {caseAlerts.length} alert{caseAlerts.length === 1 ? "" : "s"} combined in this case
        </div>
        <div className="flex flex-col gap-1.5">
          {caseAlerts.map((al) => (
            <div key={al.id} className="flex items-center gap-2.5 text-xs">
              <span className="rounded border border-amber-300 bg-white px-1.5 py-0.5 font-mono text-[11px] text-amber-800">
                {al.id}
              </span>
              <span className="flex-1 text-heading/80">{al.title}</span>
              <span className="text-muted-foreground">{al.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {pois.map((poi) => (
          <PoiCard key={poi.id} poi={poi} onRemove={removePoi} />
        ))}
      </div>

      {adding ? (
        <div className="mt-3.5 flex flex-col gap-2.5 rounded-lg border border-border p-3.5 sm:flex-row sm:items-center">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Full name"
            className="flex-1 text-sm"
          />
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role (e.g. beneficiary)"
            className="text-sm sm:w-56"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <IconPlus className="size-3.5" />
          Add person of interest
        </button>
      )}
    </div>
  );
}
