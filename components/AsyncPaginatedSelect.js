'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from './ui/label';
import _ from 'lodash';
import { IconLoader2 } from '@tabler/icons-react';
export default function CustomSelect({
  options = [],
  value,
  name = '',
  onChange,
  onAddItem,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  className,
  error,
  isAsync = false,
  onAsyncSearch,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [fetching, setFetching] = React.useState(false);

  const [allOptions, setAllOptions] = React.useState([]);

  const selectedOption = allOptions?.find((option) => option.value === value);

  const fetchAllOptions = async () => {
    setFetching(true);
    const data = await onAsyncSearch('');
    setAllOptions(data);
    setFetching(false);
  };
  React.useEffect(() => {
    if (isAsync) {
      fetchAllOptions();
    }
  }, []);
  React.useEffect(() => {
    if (options.length > 0) {
      setAllOptions(options);
    }
  }, [options]);

  const handleSelect = (currentValue, option) => {
    onChange?.({
      target: {
        name: name,
        value: option.value,
        option: option,
      },
    });
    setOpen(false);
    setSearchValue('');
  };

  const handleAddItem = () => {
    if (searchValue.trim()) {
      onAddItem?.(searchValue.trim());
      setSearchValue('');
      setOpen(false);
    }
  };

  const filteredOptions = allOptions?.filter((option) =>
    option.label?.toLowerCase().includes(searchValue?.toLowerCase())
  );

  const showAddOption =
    onAddItem &&
    searchValue.trim() !== '' &&
    !options.some(
      (option) => option.label.toLowerCase() === searchValue.toLowerCase()
    );
  const debouncedSearch = _.debounce(async (value) => {
    setFetching(true);

    const data = await onAsyncSearch(value);
    console.log('debounced data', data);
    setAllOptions(data);
    setFetching(false);
  }, 500);
  const handleAsyncSearch = async (value) => {
    console.log('value', value);
    setSearchValue(value?.trim());
    //need to be debounced

    debouncedSearch(value);
  };
  return (
    <div>
      {/* {label && <Label>{label}</Label>} */}
      <Popover open={open} onOpenChange={setOpen} className="" modal={false}>
        <PopoverTrigger asChild className={cn(error && 'border-red-500')}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between font-normal bg-white hover:bg-muted',
              className,
              error && 'border-red-500'
            )}
          >
            {selectedOption ? (
              <span className="truncate">{selectedOption.label}</span>
            ) : (
              <span className="text-muted-foreground">
                {placeholder || 'Select an option...'}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 "
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={isAsync ? handleAsyncSearch : setSearchValue}
            />
            {fetching ? (
              <CommandList>
                <CommandItem>
                  <IconLoader2 className="size-4 animate-spin mr-2" />
                  Loading...
                </CommandItem>
              </CommandList>
            ) : (
              <CommandList>
                {filteredOptions.length === 0 && !showAddOption && (
                  <CommandEmpty>{emptyText}</CommandEmpty>
                )}
                {filteredOptions.length > 0 && (
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        className={'text-xs hover:bg-muted cursor-pointer'}
                        onSelect={(value) => handleSelect(value, option)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {showAddOption && (
                  <>
                    {filteredOptions.length > 0 && <CommandSeparator />}
                    <CommandGroup>
                      <CommandItem
                        onSelect={handleAddItem}
                        className="text-primary"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add &quot;{searchValue}&quot;
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
