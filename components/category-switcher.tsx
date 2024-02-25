"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import Button from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CategorySwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function CategorySwitcher({
  className,
  items = [],
}: CategorySwitcherProps) {
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentCategory = formattedItems.find(
    (item) => item.value === params.categoryId
  );

  console.log("currentCategory", currentCategory);
  const [open, setOpen] = React.useState(false);

  const onCategorySelect = (category: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/category/${category.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="Outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] h-10 flex items-center justify-center"
        >
          {currentCategory ? currentCategory?.label : "Search Category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Category..." />
          <CommandEmpty>No category found</CommandEmpty>
          <CommandGroup>
            {formattedItems.map((category) => (
              <CommandItem
                key={category.value}
                onSelect={() => onCategorySelect(category)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentCategory?.value === category.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
