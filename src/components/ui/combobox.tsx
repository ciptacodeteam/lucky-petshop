"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ComboboxOption = {
  label: string;
  value: string;
};

type Props = {
  options: ComboboxOption[];
  placeholder?: string;
  emptyIndicator?: React.ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function Combobox({
  options,
  placeholder,
  emptyIndicator,
  onValueChange,
  value,
  disabled = false,
  loading = false,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(loading ? "w-full justify-start" : "justify-between")}
          disabled={disabled}
          loading={loading}
        >
          {!loading && (
            <>
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder || "Select..."}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeholder || "Search..."} />
          <CommandList>
            <CommandEmpty>{emptyIndicator || "No results found."}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
