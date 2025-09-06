"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, FilterX } from "lucide-react";

export interface FilterConfig {
  type: "text" | "number" | "enum" | "boolean";
  options?: string[]; // For enum type
}

export interface FilterValue {
  text?: string;
  number?: { min: string; max: string };
  enum?: string[];
  boolean?: boolean;
}

interface FilterDropdownProps {
  columnId: string;
  config: FilterConfig;
  value: FilterValue | null;
  onChange: (value: FilterValue | null) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function FilterDropdown({
  columnId,
  config,
  value,
  onChange,
  isActive,
  onToggle,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
    onToggle();
  };

  const clearFilter = () => {
    onChange(null);
    setIsOpen(false);
  };

  const renderFilterContent = () => {
    switch (config.type) {
      case "text":
        return (
          <div className="p-3 space-y-2">
            <Input
              placeholder="Filtrer..."
              value={value?.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              className="w-48"
            />
          </div>
        );

      case "number":
        return (
          <div className="p-3 space-y-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={value?.number?.min || ""}
                onChange={(e) =>
                  onChange({
                    number: {
                      min: e.target.value,
                      max: value?.number?.max || "",
                    },
                  })
                }
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Max"
                value={value?.number?.max || ""}
                onChange={(e) =>
                  onChange({
                    number: {
                      min: value?.number?.min || "",
                      max: e.target.value,
                    },
                  })
                }
                className="w-20"
              />
            </div>
          </div>
        );

      case "enum":
        return (
          <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
            {config.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${columnId}-${option}`}
                  checked={value?.enum?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = value?.enum || [];
                    if (checked) {
                      onChange({ enum: [...currentValues, option] });
                    } else {
                      onChange({
                        enum: currentValues.filter((v) => v !== option),
                      });
                    }
                  }}
                />
                <label
                  htmlFor={`${columnId}-${option}`}
                  className="text-sm cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "boolean":
        return (
          <div className="p-3 space-y-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${columnId}-true`}
                  checked={value?.boolean === true}
                  onCheckedChange={(checked) =>
                    onChange({ boolean: checked ? true : undefined })
                  }
                />
                <label
                  htmlFor={`${columnId}-true`}
                  className="text-sm cursor-pointer"
                >
                  Vrai
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${columnId}-false`}
                  checked={value?.boolean === false}
                  onCheckedChange={(checked) =>
                    onChange({ boolean: checked ? false : undefined })
                  }
                />
                <label
                  htmlFor={`${columnId}-false`}
                  className="text-sm cursor-pointer"
                >
                  Faux
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFilterClick}
        className={`h-6 w-6 p-0 ${
          isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Filter className="h-3 w-3" />
      </Button>

      {isOpen && (
        <div className="absolute top-8 left-0 z-50 bg-secondary border border-secondary rounded-md shadow-lg">
          {renderFilterContent()}
          {isActive && (
            <div className="border-t border-gray-200 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FilterX className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// favorite version

interface FilterComponentProps {
  column: any;
  filterValue: any;
  onFilterChange: (value: any) => void;
  onClose: () => void;
  columnType: "text" | "number" | "enum" | "boolean";
  enumOptions?: string[];
}

export const FilterComponent = ({
  //   column,
  filterValue,
  onFilterChange,
  onClose,
  columnType,
  enumOptions,
}: FilterComponentProps) => {
  const [localValue, setLocalValue] = useState(filterValue?.text || "");
  const [numberRange, setNumberRange] = useState({
    min: filterValue?.number?.min || "",
    max: filterValue?.number?.max || "",
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    filterValue?.enum || []
  );
  const [booleanValue, setBooleanValue] = useState<boolean | null>(
    filterValue?.boolean
  );
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleApplyFilter = () => {
    switch (columnType) {
      case "text":
        onFilterChange({ text: localValue });
        break;
      case "number":
        onFilterChange({
          number: { min: numberRange.min, max: numberRange.max },
        });
        break;
      case "enum":
        onFilterChange({ enum: selectedOptions });
        break;
      case "boolean":
        onFilterChange({ boolean: booleanValue });
        break;
    }
    onClose();
  };

  const handleClearFilter = () => {
    onFilterChange(null);
    onClose();
  };

  return (
    <div
      ref={filterRef}
      className="absolute top-full left-0 z-50 mt-1 p-4 bg-secondary border border-secondary-foreground rounded-lg shadow-lg min-w-[250px]"
    >
      <div className="space-y-3">
        {columnType === "text" && (
          <Input
            placeholder="Filtrer par texte..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="w-full"
          />
        )}

        {columnType === "number" && (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min"
              min={0}
              value={numberRange.min}
              onChange={(e) =>
                setNumberRange((prev) => ({ ...prev, min: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={numberRange.max}
              onChange={(e) =>
                setNumberRange((prev) => ({ ...prev, max: e.target.value }))
              }
            />
          </div>
        )}

        {columnType === "enum" && enumOptions && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {enumOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOptions((prev) => [...prev, option]);
                    } else {
                      setSelectedOptions((prev) =>
                        prev.filter((item) => item !== option)
                      );
                    }
                  }}
                />
                <label htmlFor={option} className="text-sm capitalize">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}

        {columnType === "boolean" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="true"
                checked={booleanValue === true}
                onCheckedChange={() =>
                  setBooleanValue(booleanValue === true ? null : true)
                }
              />
              <label htmlFor="true" className="text-sm">
                Actif
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="false"
                checked={booleanValue === false}
                onCheckedChange={() =>
                  setBooleanValue(booleanValue === false ? null : false)
                }
              />
              <label htmlFor="false" className="text-sm">
                Inactif
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t">
          <Button variant="destructive" size="sm" onClick={handleClearFilter} className="hover:cursor-pointer">
            <FilterX className="h-3 w-3 mr-1" />
            Effacer
          </Button>
          <Button size="sm" onClick={handleApplyFilter} className="hover:cursor-pointer">

            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
};
