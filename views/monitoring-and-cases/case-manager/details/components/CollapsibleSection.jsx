"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function CollapsibleSection({
  id,
  title,
  icon: Icon,
  badge,
  defaultOpen = true,
  actions,
  children,
  sectionRef,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card ref={sectionRef} id={id} className="scroll-mt-4 border-border py-0 shadow-sm">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between gap-2 px-5 py-4">
          <CollapsibleTrigger asChild>
            <button className="flex flex-1 items-center gap-2.5 text-left">
              <IconChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  !open && "-rotate-90",
                )}
              />
              {Icon && <Icon className="size-4 shrink-0 text-heading" />}
              <span className="text-sm font-semibold text-heading">{title}</span>
              {badge !== undefined && badge !== null && (
                <Badge variant="outline" className="text-xs">
                  {badge}
                </Badge>
              )}
            </button>
          </CollapsibleTrigger>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        <CollapsibleContent>
          <CardContent className="pb-5">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
