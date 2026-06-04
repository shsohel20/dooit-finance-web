"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle } from "lucide-react";

const progressSteps = [
  { key: "sector", label: "Sector information", done: true },
  { key: "client_types", label: "Client Types", active: true },
  { key: "delivery_channels", label: "Delivery channels" },
  { key: "designated_services", label: "Designated services risk factors" },
  { key: "client_risk", label: "Client risk factors" },
  { key: "delivery_risk", label: "Delivery channel risk factors" },
  { key: "country", label: "Country" },
];

const clientTypes = [
  {
    key: "individuals",
    label: "Individuals and sole traders",
    description:
      "An individual client, other than a sole trader, is a human being with legal capacity to enter into contracts and conduct transactions. A sole trader is an individual client who owns and runs a business alone, with no legal separation between the owner and the business. Like individuals, sole traders have the legal capacity to enter into contracts and conduct transactions.",
  },
  {
    key: "bodies_corporate",
    label: "Bodies corporate",
    description:
      "A body corporate is a type of legal structure with a separate legal identity from their owners or members. A body corporate is recognised by law as having its own rights and obligations. The most common forms of companies are: private companies (Proprietary Limited), public companies (Limited), unlisted public companies (Limited), owner's strata corporations, cooperatives, incorporated partnerships",
  },
  {
    key: "partnerships",
    label: "Partnerships",
    description:
      "A partnership refers to where 2 or more individuals or other legal entities share ownership. A partnership isn't a separate legal entity from its owners. The most common forms of partnerships are: • general partnerships (simpler) • limited partnerships (more complex).",
  },
  {
    key: "trusts",
    label: "Trusts",
    description:
      "A trust refers to a legal arrangement where one or more trustees hold and manage assets for the benefit of one or more beneficiaries. A trustee may be an individual or a legal entity (such as a company). The most common forms of trusts are: discretionary trusts (often used for family trusts), unit trusts (often used by investment firms), testamentary trusts (often created as part of an estate).",
  },
];

export default function ClientTypesPrimary() {
  const [selected, setSelected] = useState({});

  const toggle = (key) =>
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-border p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Progress
        </p>
        <ul className="space-y-3">
          {progressSteps.map((step) => (
            <li key={step.key} className="flex items-center gap-2.5">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              ) : step.active ? (
                <div className="w-5 h-5 rounded-full border-2 border-teal-600 bg-teal-600 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <span
                className={
                  step.active
                    ? "text-sm font-semibold text-foreground"
                    : step.done
                    ? "text-sm text-foreground"
                    : "text-sm text-muted-foreground"
                }
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 max-w-4xl">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Who are your clients?
        </h1>
        <p className="text-sm text-muted-foreground mb-6">Select all that apply</p>

        <div className="space-y-4">
          {clientTypes.map((type) => (
            <div
              key={type.key}
              className="bg-white border border-border rounded-lg p-5 cursor-pointer hover:border-teal-400 transition-colors"
              onClick={() => toggle(type.key)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={type.key}
                  checked={!!selected[type.key]}
                  onCheckedChange={() => toggle(type.key)}
                  className="mt-0.5 shrink-0"
                />
                <div>
                  <label
                    htmlFor={type.key}
                    className="text-sm font-semibold text-foreground cursor-pointer"
                  >
                    {type.label}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
