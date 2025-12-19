"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, errors, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2  leading-none  select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50  font-semibold text-[0.7rem]  mb-2",
        className,
        errors && "text-destructive",
      )}
      {...props}
    />
  );
}

export { Label };
