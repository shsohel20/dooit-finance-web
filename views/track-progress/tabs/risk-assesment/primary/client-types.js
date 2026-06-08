"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const CLIENT_TYPES = [
  // {
  //   key: "Lawyers&Conveyancers",
  //   label: "Lawyers & Conveyancers",
  //   description:
  //     "A lawyer is a professional who provides legal advice and representation to clients. A conveyancer is a professional who provides legal advice and representation to clients on property matters.",
  // },
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

export default function ClientTypesStep({ selected = {}, onChange }) {
  const toggle = (key) => onChange({ ...selected, [key]: !selected[key] });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Who are your clients?</h1>
      <p className="text-sm text-muted-foreground mb-6">Select all that apply</p>

      <div className="space-y-4">
        {CLIENT_TYPES.map((type) => (
          <div
            key={type.key}
            className={`border rounded-lg p-5 cursor-pointer transition-colors ${
              selected[type.key]
                ? "bg-teal-50 border-teal-400"
                : "bg-white border-border hover:border-teal-300"
            }`}
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
    </div>
  );
}
