import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusPillVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-xs relative ",

  {
    variants: {
      variant: {
        default: "before:bg-primary",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [&>svg]:text-foreground [&>svg]:fill-foreground before:bg-foreground",
        warning:
          "before:bg-warning [&>svg]:text-warning [&>svg]:fill-warning before:bg-warning",
        success:
          "before:bg-success [&>svg]:text-success [&>svg]:fill-success before:bg-success",
        info: "before:bg-info [&>svg]:text-info [&>svg]:fill-info before:bg-info",
        danger:
          "before:bg-danger [&>svg]:text-danger [&>svg]:fill-danger before:bg-danger",
        dark: "border-transparent bg-dark text-white [a&]:hover:bg-dark/90 [&>svg]:text-dark [&>svg]:fill-dark before:bg-dark",
        muted:
          "border-transparent bg-muted text-white [a&]:hover:bg-muted/90 [&>svg]:text-muted [&>svg]:fill-muted before:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function StatusPill({ className, variant, asChild = false, icon, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <div
      className={cn(statusPillVariants({ variant }), className, {
        "before:content-[''] before:absolute before:top-1/2 before:translate-y-[-50%] pl-4 before:left-1 before:size-2 before:rounded-full before:bg-current ":
          !icon,
      })}
    >
      {icon && icon}

      <Comp data-slot="badge" {...props} />
    </div>
  );
}

export { StatusPill, statusPillVariants };
