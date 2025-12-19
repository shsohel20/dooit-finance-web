"use client";

import { Controller, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { get } from "react-hook-form";

export function FormField({
  form,
  name,
  label,
  type = "text",
  placeholder,
  required,
  options,
  description,
}) {
  const {
    control,
    formState: { errors },
  } = form;
  const error = get(errors, name)?.message;
  if (type === "checkbox") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox id={name} checked={field.value || false} onCheckedChange={field.onChange} />
            {label && (
              <Label errors={errors[name]?.message} className="mb-0" htmlFor={name}>
                {label}
              </Label>
            )}
          </div>
        )}
      />
    );
  }

  if (type === "select") {
    return (
      <div className="flex flex-col ">
        {label && (
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger id={name}>
                <SelectValue placeholder={placeholder || ""} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="flex flex-col ">
        {label && (
          <Label htmlFor={name}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Textarea id={name} placeholder={placeholder} {...field} value={field.value || ""} />
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-col ">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            {...field}
            value={field.value || ""}
            error={error}
          />
        )}
      />
    </div>
  );
}
