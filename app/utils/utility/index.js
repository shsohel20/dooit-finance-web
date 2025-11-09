import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging Tailwind classes
const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export { cn };
