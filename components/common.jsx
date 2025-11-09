import { cn } from "@/lib/utils";

export const PageTitle = ({ children, className }) => {
  return (
    <h2 className={cn("text-foreground text-base font-semibold", className)}>
      {children}
    </h2>
  );
};

export const PageDescription = ({ children, className }) => {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
};

export const PageHeader = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>{children}</div>
  );
};
