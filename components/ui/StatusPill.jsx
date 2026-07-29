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
          "before:bg-warning [&>svg]:text-warning [&>svg]:fill-warning before:bg-warning bg-warning/10 border-warning/10 text-yellow-700",
        // Text colours are a darker step than the brand token, because the
        // brand hue on its own 10% tint is too light to read — measured on a
        // white surface (docs/65 Step 70): info was 2.75:1, below the 3:1
        // floor. The dot (`before:`) and any icon keep the true brand colour,
        // so identity is unchanged; only the label is darkened. This is the
        // same trick the `warning` variant already used with yellow-700.
        success:
          "before:bg-success [&>svg]:text-success [&>svg]:fill-success bg-success/10 border-success/20 text-green-700",
        info: "before:bg-info [&>svg]:text-info [&>svg]:fill-info bg-info/10 border-info/20 text-cyan-800",
        danger:
          "before:bg-danger [&>svg]:text-danger [&>svg]:fill-danger bg-danger/10 border-danger/20 text-pink-700",
        // `dark` and `muted` previously listed conflicting utilities in one
        // string — `bg-dark text-white … bg-dark/10 … text-dark`. Tailwind
        // keeps the LAST of each conflicting pair, so they resolved to
        // text-dark on bg-dark/10 and, worse, text-muted on bg-muted/10.
        // `--muted` is oklch(0.97) — near-white — so the muted pill was
        // near-white text on a near-white tint, i.e. invisible. That is what
        // hid the "Draft" review status in the register (docs/65 Step 70).
        // Both now name one background and one readable foreground.
        dark: "border-dark/20 bg-dark/10 text-dark [&>svg]:text-dark [&>svg]:fill-dark before:bg-dark",
        muted:
          "border-border bg-muted text-muted-foreground [&>svg]:text-muted-foreground [&>svg]:fill-muted-foreground before:bg-muted-foreground",
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
        "before:content-[''] text-xs before:absolute before:top-1/2 before:translate-y-[-50%] pl-4 before:left-1 before:size-2 before:rounded-full before:bg-current ":
          !icon,
      })}
    >
      {icon && icon}

      <Comp data-slot="badge" {...props} />
    </div>
  );
}

export { StatusPill, statusPillVariants };
