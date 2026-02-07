import { cn } from '@/lib/utils';

export const PageTitle = ({ children, className }) => {
  return (
    <h2
      className={cn(
        'text-xl font-semibold tracking-tight text-neutral-700',
        className
      )}
    >
      {children}
    </h2>
  );
};

export const PageDescription = ({ children, className }) => {
  return <p className={cn('text-muted-foreground ', className)}>{children}</p>;
};

export const PageHeader = ({ children, className }) => {
  return <div className={cn('flex flex-col mb-6', className)}>{children}</div>;
};
