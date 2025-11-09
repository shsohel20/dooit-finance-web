"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useFieldArray } from "react-hook-form";

export function DocumentsSection({ control, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const addDocument = () => {
    append({
      name: "",
      url: "",
      mimeType: "application/pdf",
      type: "license",
    });
  };

  const removeDocument = (index) => {
    remove(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Upload and manage company documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((document, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Document {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name={`documents.${index}.name`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`doc-name-${index}`}>Document Name</Label>
                    <Input
                      id={`doc-name-${index}`}
                      {...field}
                      placeholder="e.g., Trade License"
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={`documents.${index}.type`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`doc-type-${index}`}>Document Type</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={`doc-type-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="license">License</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="permit">Permit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>

            <Controller
              control={control}
              name={`documents.${index}.url`}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor={`doc-url-${index}`}>Document URL</Label>
                  <Input
                    id={`doc-url-${index}`}
                    type="url"
                    {...field}
                    placeholder="https://example.com/document.pdf"
                    error={errors.documents?.[index]?.url?.message}
                  />
                </div>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addDocument}
          className="w-full bg-transparent"
        >
          + Add Another Document
        </Button>
      </CardContent>
    </Card>
  );
}
