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
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useFieldArray } from "react-hook-form";

export function ContactsSection({ control, errors }) {
  const {
    fields: contactFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const addContact = () => {
    append({
      name: "",
      title: "",
      email: "",
      phone: "",
      primary: false,
    });
  };

  const removeContact = (index) => {
    remove(index);
  };

  return (
    <Card className={"shadow-none"}>
      <CardHeader>
        <CardTitle>Primary Contacts</CardTitle>
        <CardDescription>
          Add key contacts for your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactFields.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Contact {index + 1}</h3>
              {contactFields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeContact(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name={`contacts.${index}.name`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`contact-name-${index}`}>Name</Label>
                    <Input
                      id={`contact-name-${index}`}
                      {...field}
                      placeholder="Full name"
                      error={errors.contacts?.[index]?.name?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={`contacts.${index}.title`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`contact-title-${index}`}>Title</Label>
                    <Input
                      id={`contact-title-${index}`}
                      {...field}
                      placeholder="Job title"
                      error={errors.contacts?.[index]?.title?.message}
                    />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name={`contacts.${index}.email`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`contact-email-${index}`}>Email</Label>
                    <Input
                      id={`contact-email-${index}`}
                      type="email"
                      {...field}
                      placeholder="email@example.com"
                      error={errors.contacts?.[index]?.email?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={`contacts.${index}.phone`}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`contact-phone-${index}`}>Phone</Label>
                    <Input
                      id={`contact-phone-${index}`}
                      {...field}
                      placeholder="+1 (555) 000-0000"
                      error={errors.contacts?.[index]?.phone?.message}
                    />
                  </div>
                )}
              />
            </div>

            <Controller
              control={control}
              name={`contacts.${index}.primary`}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`contact-primary-${index}`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    error={errors.contacts?.[index]?.primary?.message}
                  />
                  <Label
                    htmlFor={`contact-primary-${index}`}
                    className="font-normal cursor-pointer"
                  >
                    Mark as primary contact
                  </Label>
                </div>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addContact}
          className="w-full bg-transparent"
        >
          + Add Another Contact
        </Button>
      </CardContent>
    </Card>
  );
}
