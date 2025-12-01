"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function PartE({ data, updateData }) {
  const [hasUnidentified, setHasUnidentified] = useState(
    data.unidentifiedPersons && data.unidentifiedPersons.length > 0
      ? "yes"
      : "no"
  );
  const [persons, setPersons] = useState(data.unidentifiedPersons || []);

  const handleAdd = () => {
    const updated = [...persons, { description: "", documentation: "" }];
    setPersons(updated);
    updateData({ unidentifiedPersons: updated });
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...persons];
    updated[index] = { ...updated[index], [field]: value };
    setPersons(updated);
    updateData({ unidentifiedPersons: updated });
  };

  const handleRemove = (index) => {
    const updated = persons.filter((_, i) => i !== index);
    setPersons(updated);
    updateData({ unidentifiedPersons: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-bold ">
          24. Is there any suspicious person whose identity could not be
          established in Part C or Part D and they are not known to the
          reporting entity?
        </Label>
        <RadioGroup
          value={hasUnidentified}
          onValueChange={(value) => {
            setHasUnidentified(value);
            if (value === "no") {
              setPersons([]);
              updateData({ unidentifiedPersons: [] });
            } else if (persons.length === 0) {
              handleAdd();
            }
          }}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="unidentified-yes" />
            <Label htmlFor="unidentified-yes" className="cursor-pointer">
              Yes, provide a description of the person(s) and list any
              documentation
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="unidentified-no" />
            <Label htmlFor="unidentified-no" className="cursor-pointer">
              No, go to Part F
            </Label>
          </div>
        </RadioGroup>
      </div>

      {hasUnidentified === "yes" && (
        <div className="space-y-6">
          {persons.map((person, index) => (
            <div
              key={index}
              className="p-6 bg-secondary/30 rounded-lg border-2 border-muted"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold ">
                  Unidentified Person {index + 1}
                </h3>
                {persons.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemove(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Description of person</Label>
                  <Textarea
                    value={person.description}
                    onChange={(e) =>
                      handleUpdate(index, "description", e.target.value)
                    }
                    placeholder="Provide physical description, behavior, or any identifying characteristics..."
                    className="mt-2 border"
                  />
                </div>
                <div>
                  <Label>Documentation held</Label>
                  <Textarea
                    value={person.documentation}
                    onChange={(e) =>
                      handleUpdate(index, "documentation", e.target.value)
                    }
                    placeholder="List any documentation (e.g., video, photograph, application form, etc.)"
                    className="mt-2 border"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAdd}
            variant="outline"
            className="border bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another unidentified person
          </Button>
        </div>
      )}
    </div>
  );
}
