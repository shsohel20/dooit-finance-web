"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, HelpCircle } from "lucide-react";
import { useState } from "react";

const DESIGNATED_SERVICES = [
  "AFSL holder arranging a designated service",
  "Account/deposit taking services",
  "Chequebook access facilities",
  "Currency exchange services",
  "Custodial/depository services",
  "Debit card access facilities",
  "Debt instruments",
  "Digital currency exchange services",
  "Electronic funds transfers",
  "Lease/hire purchase services",
  "Life insurance services",
  "Loan services",
  "Money/postal orders",
  "Payroll services",
  "Pension/annuity services",
  "Remittance services (money transfers)",
  "Retirement savings accounts",
  "Securities market/investment services",
  "Stored value cards",
  "Superannuation/approved deposit funds",
  "Traveller's cheque exchange services",
  "Bullion dealing",
  "Betting",
  "Betting accounts",
  "Chips/currency exchange",
  "Games of chance or skill",
  "Gaming machines",
];

const SUSPICION_REASONS = [
  "ATM/cheque fraud",
  "Advanced fee/scam",
  "Avoiding reporting obligations",
  "Corporate/investment fraud",
  "Counterfeit currency",
  "Country/jurisdiction risk",
  "Credit card fraud",
  "Credit/loan facility fraud",
  "Currency not declared at border",
  "DFAT watch list",
  "False name/identity or documents",
  "Immigration related issue",
  "Inconsistent with customer profile",
  "Internet fraud",
  "National security concern",
  "Other watch list",
  "Phishing",
  "Refusal to show identification",
  "Social security issue",
  "Suspected/known criminal",
  "Suspicious behaviour",
  "Unauthorised account transactions",
  "Unusual account activity",
  "Unusual financial instrument",
  "Unusual gambling activity",
  "Unusual use/exchange of cash",
  "Unusually large FX transaction",
  "Unusually large cash transaction",
  "Unusually large transfer",
];

export function PartA({ data, updateData }) {
  const [selectedServices, setSelectedServices] = useState(
    data.designatedServices || []
  );
  const [serviceStatus, setServiceStatus] = useState(
    data.serviceStatus || "provided"
  );
  const [selectedReasons, setSelectedReasons] = useState(
    data.suspicionReasons || []
  );
  const [otherReasons, setOtherReasons] = useState(data.otherReasons || [""]);

  const handleServiceToggle = (service) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(updated);
    updateData({ designatedServices: updated });
  };

  const handleReasonToggle = (reason) => {
    const updated = selectedReasons.includes(reason)
      ? selectedReasons.filter((r) => r !== reason)
      : [...selectedReasons, reason];
    setSelectedReasons(updated);
    updateData({ suspicionReasons: updated });
  };

  const addOtherReason = () => {
    setOtherReasons([...otherReasons, ""]);
  };

  const updateOtherReason = (index, value) => {
    const updated = [...otherReasons];
    updated[index] = value;
    setOtherReasons(updated);
    updateData({ otherReasons: updated.filter((r) => r.trim() !== "") });
  };

  return (
    <div className="space-y-8">
      {/* Question 1 */}
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Label className="text-base font-bold ">
            1. Please specify the designated service(s) to which the suspicious
            matter relates
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-secondary/50 rounded-md border border-muted">
          {DESIGNATED_SERVICES.map((service) => (
            <div key={service} className="flex items-start gap-2">
              <Checkbox
                id={service}
                checked={selectedServices.includes(service)}
                onCheckedChange={() => handleServiceToggle(service)}
              />
              <label
                htmlFor={service}
                className="text-sm leading-tight cursor-pointer"
              >
                {service}
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold">
              Was the designated service(s):
            </Label>
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <RadioGroup
            value={serviceStatus}
            onValueChange={(value) => {
              setServiceStatus(value);
              updateData({ serviceStatus: value });
            }}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="provided" id="provided" />
              <Label htmlFor="provided" className="cursor-pointer">
                Provided
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="requested" id="requested" />
              <Label htmlFor="requested" className="cursor-pointer">
                Requested
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="enquired" id="enquired" />
              <Label htmlFor="enquired" className="cursor-pointer">
                Enquired about
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Question 2 */}
      <div className="space-y-4 pt-6 border-t-2 ">
        <div className="flex items-start gap-2">
          <Label className="text-base font-bold ">
            2. Please specify the reason(s) for the suspicion, which may include
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-secondary/50 rounded-md border border-muted">
          {SUSPICION_REASONS.map((reason) => (
            <div key={reason} className="flex items-start gap-2">
              <Checkbox
                id={reason}
                checked={selectedReasons.includes(reason)}
                onCheckedChange={() => handleReasonToggle(reason)}
              />
              <label
                htmlFor={reason}
                className="text-sm leading-tight cursor-pointer"
              >
                {reason}
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Other, please specify:
          </Label>
          {otherReasons.map((reason, index) => (
            <Input
              key={index}
              value={reason}
              onChange={(e) => updateOtherReason(index, e.target.value)}
              placeholder="Specify other reason for suspicion"
              className="border-2 "
            />
          ))}
          <Button
            type="button"
            onClick={addOtherReason}
            variant="outline"
            size="sm"
            className=" bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another reason for suspicion
          </Button>
        </div>
      </div>
    </div>
  );
}
