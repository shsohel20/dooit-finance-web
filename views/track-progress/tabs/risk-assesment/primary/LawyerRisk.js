"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const questions = [
  {
    key: "real_estate_conveyancing",
    label: "Do you assist in the planning or execution of real estate transactions (conveyancing)?",
    description:
      "Real estate transactions include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
  {
    key: "body_corporate_sale_purchase_transfer",
    label:
      "Do you assist in the sale, purchase or transfer of a body corporate or legal arrangement?",
    description:
      "Body corporate transactions include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
  {
    key: "client_money_accounts_securities",
    label:
      "Do you receive, hold, control or manage client money, accounts, securities or property as part of a transaction?",
    description:
      "Client money, accounts, securities or property include money, accounts, securities or property that is held by the lawyer for the client.",
  },
  {
    key: "equity_debt_financing",
    label: "Do you assist with equity or debt financing for a body corporate or legal arrangement?",
    description:
      "Equity or debt financing include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
  {
    key: "shelf_companies",
    label: "Do you sell or transfer shelf companies?",
    description:
      "Shelf companies include companies that are not actively traded on the stock market.",
  },
  {
    key: "creation_restructuring",
    label:
      "Do you assist in the creation or restructuring of a body corporate or legal arrangement?",
    description:
      "Creation or restructuring of a body corporate or legal arrangement include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
  {
    key: "director_secretary_trustee",
    label:
      "Do you act (or arrange for another to act) as director, company secretary, power of attorney, trustee, or partner?",
    description:
      "Director, company secretary, power of attorney, trustee, or partner include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
  {
    key: "nominee_shareholder",
    label: "Do you act (or arrange for another to act) as a nominee shareholder?",
    description:
      "Nominee shareholder include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
  {
    key: "registered_office_address",
    label:
      "Do you provide a registered office address or principal place of business address for a body corporate?",
    description:
      "Registered office address or principal place of business address for a body corporate include buying, selling, leasing, mortgaging, and other property-related matters.",
  },
];

export default function LawyerRisk() {
  const [answers, setAnswers] = useState({});

  const setAnswer = (key, value) => setAnswers((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Lawyer Risk Assessment</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Answer <span className="text-teal-600 font-medium">yes or no</span> for each question to
        assess the risk of the lawyer.
      </p>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question.key}
            className={`border rounded-lg p-5 transition-colors ${
              answers[question.key] === "yes"
                ? "bg-teal-50 border-teal-400"
                : "bg-white border-border hover:border-teal-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-sm font-semibold text-muted-foreground shrink-0 mt-0.5">
                {index + 1}.
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {question.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {question.description}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Label
                    htmlFor={`${question.key}_toggle`}
                    className={`text-sm cursor-pointer ${
                      answers[question.key] === "no"
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    No
                  </Label>
                  <Switch
                    id={`${question.key}_toggle`}
                    checked={answers[question.key] === "yes"}
                    onCheckedChange={(checked) => setAnswer(question.key, checked ? "yes" : "no")}
                    className="data-[state=checked]:bg-teal-600"
                  />
                  <Label
                    htmlFor={`${question.key}_toggle`}
                    className={`text-sm cursor-pointer ${
                      answers[question.key] === "yes"
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Yes
                  </Label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
