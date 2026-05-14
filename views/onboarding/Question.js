import { cn } from "@/lib/utils";
import React from "react";

export default function Question({ children, className, preset }) {
  return (
    <h4
      className={cn(
        "text-xl text-start",
        preset === "individual" &&
          "text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.65rem] leading-snug",
        className,
      )}
    >
      {children}
    </h4>
  );
}

export const QuestionDescription = ({ children, className, preset }) => {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground text-start mt-1",
        preset === "individual" &&
          "mt-2 text-[0.9375rem] leading-relaxed text-neutral-400 font-normal",
        className,
      )}
    >
      {children}
    </p>
  );
};
