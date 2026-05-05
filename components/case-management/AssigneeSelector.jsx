'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInvestigators } from '@/app/dashboard/client/case-management/actions';

export default function AssigneeSelector({ value = [], onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [investigators, setInvestigators] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getInvestigators();
        if (res?.succeed) setInvestigators(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id) => {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange(next);
  };

  const remove = (id) => onChange(value.filter((v) => v !== id));

  const selected = investigators.filter((inv) => value.includes(inv._id));

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || loading}
            className="w-full justify-between font-normal"
          >
            {loading ? 'Loading…' : 'Select investigators…'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command>
            <CommandInput placeholder="Search by name…" />
            <CommandList>
              <CommandEmpty>No investigators found.</CommandEmpty>
              <CommandGroup>
                {investigators.map((inv) => (
                  <CommandItem
                    key={inv._id}
                    value={inv.name}
                    onSelect={() => toggle(inv._id)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn('h-4 w-4', value.includes(inv._id) ? 'opacity-100' : 'opacity-0')}
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={inv.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {inv.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{inv.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground truncate">{inv.email}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((inv) => (
            <span
              key={inv._id}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={inv.avatar} />
                <AvatarFallback className="text-[8px]">
                  {inv.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {inv.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(inv._id)}
                  className="ml-0.5 rounded-full hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
