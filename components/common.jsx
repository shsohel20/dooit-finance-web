import { cn } from "@/lib/utils";

export const PageTitle = ({ children, className }) => {
  return (
    <h2 className={cn("text-3xl font-bold tracking-tight", className)}>
      {children}
    </h2>
  );
};

export const PageDescription = ({ children, className }) => {
  return (
    <p className={cn("text-muted-foreground mt-1", className)}>{children}</p>
  );
};

export const PageHeader = ({ children, className }) => {
  return <div className={cn("flex flex-col mb-8", className)}>{children}</div>;
};
