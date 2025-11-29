"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";

export function PartH({ data, updateData }) {
  const [entity, setEntity] = useState(
    data.reportingEntity || {
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        postcode: "",
        country: "Australia",
      },
      // branchName: "",
      // internalReference: "",
      completedBy: { name: "", jobTitle: "", phone: "", email: "" },
    }
  );

  const handleUpdate = (field, value) => {
    const updated = { ...entity };
    const keys = field.split(".");
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEntity(updated);
    updateData({ reportingEntity: updated });
  };

  return (
    <div className="space-y-6">
      {/* Question 46 */}
      <div className="space-y-2">
        <Label className="text-base font-bold ">
          46. Name of reporting entity
        </Label>
        <Input
          value={entity.name}
          onChange={(e) => handleUpdate("name", e.target.value)}
          placeholder="Company Name"
          className="border"
        />
      </div>

      {/* Question 47 */}
      <div className="space-y-3">
        <Label className="text-base font-bold ">
          47. Business/residential address (cannot be a post box address)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-sm">Full street address</Label>
            <Input
              value={entity.address.street}
              onChange={(e) => handleUpdate("address.street", e.target.value)}
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">City/town/suburb</Label>
            <Input
              value={entity.address.city}
              onChange={(e) => handleUpdate("address.city", e.target.value)}
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">State</Label>
            <Input
              value={entity.address.state}
              onChange={(e) => handleUpdate("address.state", e.target.value)}
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">Postcode</Label>
            <Input
              value={entity.address.postcode}
              onChange={(e) => handleUpdate("address.postcode", e.target.value)}
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">Country</Label>
            <Input
              value={entity.address.country}
              onChange={(e) => handleUpdate("address.country", e.target.value)}
              className="mt-1 border"
            />
          </div>
        </div>
      </div>

      {/* Question 48 */}
      {/* <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-base font-bold ">
            48. Name of branch/office/retail outlet or location where the matter
            was identified
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          value={entity.branchName}
          onChange={(e) => handleUpdate("branchName", e.target.value)}
          className="border"
        />
      </div> */}

      {/* Question 49 */}
      {/* <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-base font-bold ">
            49. Reporting entity's internal reference number (if applicable)
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          value={entity.internalReference}
          onChange={(e) => handleUpdate("internalReference", e.target.value)}
          className="border"
        />
      </div> */}

      {/* Question 50 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-base font-bold ">
            50. Details of person completing this report
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Given names and family name</Label>
            <Input
              value={entity.completedBy.name}
              onChange={(e) => handleUpdate("completedBy.name", e.target.value)}
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">Job title</Label>
            <Input
              value={entity.completedBy.jobTitle}
              onChange={(e) =>
                handleUpdate("completedBy.jobTitle", e.target.value)
              }
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">Phone</Label>
            <Input
              value={entity.completedBy.phone}
              onChange={(e) =>
                handleUpdate("completedBy.phone", e.target.value)
              }
              className="mt-1 border"
            />
          </div>
          <div>
            <Label className="text-sm">Email</Label>
            <Input
              type="email"
              value={entity.completedBy.email}
              onChange={(e) =>
                handleUpdate("completedBy.email", e.target.value)
              }
              className="mt-1 border"
            />
          </div>
        </div>
      </div>

      {/* Acknowledgment */}
      <div className="pt-6 border-t/20 space-y-4">
        <div className="p-4 bg-secondary/50 rounded-md border border-muted">
          <p className="text-sm font-medium">
            This report is made pursuant to the requirements of applicable law.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            I acknowledge that criminal penalties may apply for providing false
            or misleading information and civil penalties may apply for failing
            to supply information.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
