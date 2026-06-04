"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const riskFactors = [
  {
    key: "high_value_unfinanced",
    label: "High value and unfinanced transactions",
    level: "MEDIUM",
    description:
      "Sales or purchases of property which involve transactions valued at $1.5 million or more, and don't involve any mortgage or other loan from a lending institution. Where the average transaction in a market is higher, criminals can place greater amounts of illicit funds in a property without drawing attention. Where a property is bought without a mortgage, there's a significant difference in scrutiny on the buyer.",
  },
  {
    key: "high_value_physical_currency",
    label: "High value physical currency transactions",
    level: "HIGH",
    description:
      "Property is purchased using high value physical currency transaction(s) (for example, in Australian dollar notes and coins or a foreign currency equivalent) valued at $50,000 or more.",
  },
  {
    key: "international_funds",
    label: "International funds transfers",
    level: "HIGH",
    description:
      "Transactions that involve the transfer of funds from or to an overseas account. International transactions can be used to obscure the origin of funds and make it harder to trace the flow of money.",
  },
  {
    key: "anonymous_clients",
    label: "Anonymous or unverified clients",
    level: "HIGH",
    description:
      "Clients who are unwilling or unable to provide sufficient identification or who request anonymity. Dealing with unverified clients increases the risk of facilitating money laundering or terrorism financing.",
  },
];

const badgeStyles = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-orange-400 text-white",
  HIGH: "bg-red-500 text-white",
};

export default function DesignatedServicesStep() {
  const [answers, setAnswers] = useState({});

  const setAnswer = (key, value) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">
        Designated service risk factors
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Review the following risk factors and determine if your firm will accept
        them or not
      </p>

      <div className="space-y-4">
        {riskFactors.map((factor) => (
          <div
            key={factor.key}
            className="bg-white border border-border rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {factor.label}
              </h3>
              <span
                className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
                  badgeStyles[factor.level] ?? "bg-gray-200 text-gray-700"
                }`}
              >
                {factor.level}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {factor.description}
            </p>

            <p className="text-sm text-foreground mb-3">
              Would your firm accept this risk?
            </p>

            <RadioGroup
              value={answers[factor.key] ?? ""}
              onValueChange={(val) => setAnswer(factor.key, val)}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id={`${factor.key}_yes`} />
                <Label htmlFor={`${factor.key}_yes`} className="text-sm font-normal cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id={`${factor.key}_no`} />
                <Label htmlFor={`${factor.key}_no`} className="text-sm font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
