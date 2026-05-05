"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  IconUserCheck,
  IconAlertTriangle,
  IconCheck,
  IconLoader2,
  IconChevronDown,
  IconX,
} from "@tabler/icons-react";
import {
  getInvestigators,
  assignInvestigators,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";

const priorityVariants = {
  low: "info",
  medium: "warning",
  high: "danger",
  critical: "dark",
};

export default function CaseAssignmentTab({ caseData, onCaseUpdate }) {
  const { investigators, setInvestigators, submitting, setSubmitting } = useCaseManagerStore();
  const [loadingInvestigators, setLoadingInvestigators] = useState(false);
  const [selected, setSelected] = useState(
    (caseData?.assignedTo || []).map((u) => u._id),
  );
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (investigators.length > 0) return;
    const load = async () => {
      setLoadingInvestigators(true);
      try {
        const res = await getInvestigators();
        if (res?.succeed) setInvestigators(res.data);
      } finally {
        setLoadingInvestigators(false);
      }
    };
    load();
  }, [investigators.length, setInvestigators]);

  const toggleInvestigator = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await assignInvestigators(caseData._id, selected);
      if (res?.succeed) {
        onCaseUpdate?.({ ...caseData, assignedTo: res.data.assignedTo });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedInvestigators = investigators.filter((u) => selected.includes(u._id));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Assign investigators */}
      <Card className="border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUserCheck className="size-4" />
            Assign Investigators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Priority display */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Priority</p>
            <StatusPill
              icon={<IconAlertTriangle />}
              variant={priorityVariants[caseData?.priority]}
            >
              <span className="capitalize">{caseData?.priority}</span>
            </StatusPill>
          </div>

          {/* Investigator multi-select */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Investigators</p>
            {loadingInvestigators ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between h-9 text-sm font-normal"
                  >
                    {selectedInvestigators.length === 0
                      ? "Select investigators..."
                      : `${selectedInvestigators.length} selected`}
                    <IconChevronDown className="size-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search investigators..." className="h-9" />
                    <CommandEmpty>No investigators found.</CommandEmpty>
                    <CommandGroup className="max-h-56 overflow-y-auto">
                      {investigators.map((u) => {
                        const isSelected = selected.includes(u._id);
                        return (
                          <CommandItem
                            key={u._id}
                            value={u.name}
                            onSelect={() => toggleInvestigator(u._id)}
                            className="gap-2"
                          >
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={u.avatar} />
                              <AvatarFallback className="text-[9px]">
                                {u.name?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="flex-1 text-sm">{u.name}</span>
                            {isSelected && <IconCheck className="size-4 text-primary" />}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}

            {/* Selected chips */}
            {selectedInvestigators.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedInvestigators.map((u) => (
                  <Badge
                    key={u._id}
                    variant="secondary"
                    className="gap-1.5 pl-1.5 pr-1 py-0.5 text-xs"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="text-[7px]">
                        {u.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {u.name}
                    <button
                      type="button"
                      onClick={() => toggleInvestigator(u._id)}
                      className="hover:text-destructive"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button size="sm" className="w-full gap-1.5" onClick={handleSave} disabled={submitting}>
            {submitting ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : saved ? (
              <IconCheck className="size-3.5" />
            ) : null}
            {saved ? "Saved" : "Save Assignment"}
          </Button>
        </CardContent>
      </Card>

      {/* Current assignment summary */}
      <Card className="border-0 border-l rounded-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUserCheck className="size-4" />
            Currently Assigned
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(caseData?.assignedTo || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No investigators assigned.</p>
          ) : (
            <div className="space-y-2">
              {caseData.assignedTo.map((u) => (
                <div key={u._id} className="flex items-center gap-2.5 rounded-lg border p-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback className="text-[10px]">
                      {u.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-heading">{u.name}</p>
                    {u.email && (
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
