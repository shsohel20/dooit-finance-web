"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TRANSACTION_TYPES = [
  "Cash deposit",
  "Cash withdrawal",
  "Electronic funds transfer",
  "Wire transfer",
  "Currency exchange",
  "Digital currency exchange",
  "Account opening",
  "Loan application",
  "Insurance policy",
  "Securities transaction",
  "Other",
];

export function TransactionForm({ data, onUpdate }) {
  const [transaction, setTransaction] = useState(data);

  const handleChange = (field, value) => {
    const updated = { ...transaction };
    const keys = field.split(".");
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setTransaction(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Basic transaction info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-semibold">
            25. Date of transaction
          </Label>
          <Input
            type="date"
            value={transaction.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="mt-1 border-2 border-primary"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">
            26. Type of transaction
          </Label>
          <Select
            value={transaction.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className="mt-1 border-2 border-primary">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Completed status */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          27. Was the transaction completed?
        </Label>
        <RadioGroup
          value={transaction.completed ? "yes" : "no"}
          onValueChange={(value) => handleChange("completed", value === "yes")}
        >
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="completed-yes" />
              <Label htmlFor="completed-yes" className="cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="completed-no" />
              <Label htmlFor="completed-no" className="cursor-pointer">
                No
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Reference number */}
      <div>
        <Label className="text-sm font-semibold">
          28. Transaction reference number
        </Label>
        <Input
          value={transaction.referenceNumber}
          onChange={(e) => handleChange("referenceNumber", e.target.value)}
          className="mt-1 border-2 border-primary"
        />
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-semibold">
            29. Total amount (AUD)
          </Label>
          <Input
            type="number"
            value={transaction.totalAmount.amount}
            onChange={(e) =>
              handleChange(
                "totalAmount.amount",
                Number.parseFloat(e.target.value)
              )
            }
            placeholder="0.00"
            className="mt-1 border-2 border-primary"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">
            30. Total cash involved (AUD)
          </Label>
          <Input
            type="number"
            value={transaction.cashAmount.amount}
            onChange={(e) =>
              handleChange(
                "cashAmount.amount",
                Number.parseFloat(e.target.value)
              )
            }
            placeholder="0.00"
            className="mt-1 border-2 border-primary"
          />
        </div>
      </div>

      {/* Sender */}
      <div className="space-y-2 pt-4 border-t border-muted">
        <Label className="text-sm font-semibold">Sender/drawer/issuer</Label>
        <Input
          value={transaction.sender.name}
          onChange={(e) => handleChange("sender.name", e.target.value)}
          placeholder="Name of sender"
          className="border-2 border-primary"
        />
      </div>

      {/* Payee */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Payee</Label>
        <Input
          value={transaction.payee.name}
          onChange={(e) => handleChange("payee.name", e.target.value)}
          placeholder="Name of payee"
          className="border-2 border-primary"
        />
      </div>

      {/* Beneficiary */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Beneficiary</Label>
        <Input
          value={transaction.beneficiary.name}
          onChange={(e) => handleChange("beneficiary.name", e.target.value)}
          placeholder="Name of beneficiary"
          className="border-2 border-primary"
        />
      </div>
    </div>
  );
}
