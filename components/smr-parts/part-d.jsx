"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { PersonOrganisationForm } from "../person-organisation-form";

export function PartD({ data, updateData }) {
  const [hasOtherParties, setHasOtherParties] = useState(
    data.otherParties && data.otherParties.length > 0 ? "yes" : "no"
  );
  const [otherParties, setOtherParties] = useState(data.otherParties || []);

  const handleAddParty = () => {
    const newParty = {
      name: "",
      otherNames: [],
      businessAddress: {
        street: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      },
      phoneNumbers: [],
      emails: [],
      accounts: [],
      digitalWallets: [],
      occupation: "",
      beneficialOwners: [],
      officeHolders: [],
      documentation: "",
      identityVerification: {
        documents: [],
        electronicSources: [],
        deviceIdentifiers: [],
      },
      isCustomer: false,
      isAuthorisedAgent: false,
    };
    const updated = [...otherParties, newParty];
    setOtherParties(updated);
    updateData({ otherParties: updated });
  };

  const handleUpdateParty = (index, party) => {
    const updated = [...otherParties];
    updated[index] = party;
    setOtherParties(updated);
    updateData({ otherParties: updated });
  };

  const handleRemoveParty = (index) => {
    const updated = otherParties.filter((_, i) => i !== index);
    setOtherParties(updated);
    updateData({ otherParties: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-bold ">
          13. Are there any other parties to which the suspicious matter
          relates?
        </Label>
        <RadioGroup
          value={hasOtherParties}
          onValueChange={(value) => {
            setHasOtherParties(value);
            if (value === "no") {
              setOtherParties([]);
              updateData({ otherParties: [] });
            } else if (otherParties.length === 0) {
              handleAddParty();
            }
          }}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="other-yes" />
            <Label htmlFor="other-yes" className="cursor-pointer">
              Yes, provide details below
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="other-no" />
            <Label htmlFor="other-no" className="cursor-pointer">
              No, go to Part E
            </Label>
          </div>
        </RadioGroup>
      </div>

      {hasOtherParties === "yes" && (
        <div className="space-y-8">
          {otherParties.map((party, index) => (
            <div
              key={index}
              className="p-6 bg-secondary/30 rounded-lg border-2 border-muted relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold ">Other Party {index + 1}</h3>
                {otherParties.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveParty(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <PersonOrganisationForm
                data={party}
                onUpdate={(updated) => handleUpdateParty(index, updated)}
                showCustomerQuestion
                showAuthorisedAgentQuestion
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddParty}
            variant="outline"
            className="border bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another party
          </Button>
        </div>
      )}
    </div>
  );
}
