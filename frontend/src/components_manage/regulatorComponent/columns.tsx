// src/components_manage/regulatorComponent/index.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Filter, FilterX, MoreHorizontal } from "lucide-react";
import { z } from "zod";
import {
  FilterComponent,
  type FilterConfig,
  type FilterValue,
} from "@/components/table-filters";
import { useState } from "react";
import EditRegulatorModal from "./edit_regulator_modal";
import DeleteRegulatorModal from "./delete_regulator_modal";

const Shema = z.object({
  id: z.string().nullable(),
  fabricant: z.string().min(1, "Le fabricant est obligatoire"),
  model: z.string().min(1, "Le modèle est obligatoire"),
  dimension_longueur: z.number().positive().optional().nullable(),
  dimension_largeur: z.number().positive().optional().nullable(),
  dimension_hauteur: z.number().positive().optional().nullable(),
  poids: z.number().positive().optional().nullable(),
  prix: z.number().optional().nullable(),
});

type TableData = z.infer<typeof Shema>;

export const filterConfigs: Record<string, FilterConfig> = {
  fabricant: { type: "text" },
  model: { type: "text" },
  dimension_module_longueur: { type: "number" },
  dimension_module_largeur: { type: "number" },
  dimension_module_hauteur: { type: "number" },
  poids: { type: "number" },
  prix: { type: "number" },
};

const FilterableHeader = ({
  title,
  column,
  columnId,
  config,
  filters,
  onFilterChange,
}: {
  title: string;
  column: any;
  columnId: string;
  config: FilterConfig;
  filters: Record<string, FilterValue>;
  onFilterChange: (columnId: string, value: FilterValue | null) => void;
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const hasFilter =
    filters[columnId] &&
    Object.values(filters[columnId]).some(
      (v) =>
        v !== null &&
        v !== undefined &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0)
    );

  return (
    <div className="relative">
      <div className="flex items-center justify-between group">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting?.(column.getIsSorted() === "asc")}
          className="text-sm font-semibold tracking-wider hover:bg-gray-50 flex-1 justify-start hover:cursor-pointer"
        >
          {title}
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilter(!showFilter)}
          className={`ml-2 h-8 w-8 p-0 
            hover:cursor-pointer

            ${
              hasFilter
                ? "text-blue-600 bg-blue-50"
                : "text-gray-400 hover:text-gray-600"
            }`}
        >
          {hasFilter ? (
            <FilterX className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>
      </div>
      {showFilter && (
        <FilterComponent
          column={column}
          filterValue={filters[columnId] || null}
          onFilterChange={(value: any) => onFilterChange(columnId, value)}
          onClose={() => setShowFilter(false)}
          columnType={config.type}
          enumOptions={config.options}
        />
      )}
    </div>
  );
};

export const createColumns = <T extends Record<string, any>>(
  filters: Record<string, FilterValue>,
  onFilterChange: (columnId: string, value: FilterValue | null) => void
): ColumnDef<T>[] => [
  {
    accessorKey: "fabricant",
    id: "fabricant",
    header: ({ column }) => (
      <FilterableHeader
        title="Fabricant"
        column={column}
        columnId="fabricant"
        config={filterConfigs.fabricant}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("fabricant")}</div>
    ),
  },
  {
    accessorKey: "model",
    id: "model",
    header: ({ column }) => (
      <FilterableHeader
        title="Modèle"
        column={column}
        columnId="model"
        config={filterConfigs.model}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center ">{row.getValue("model")}</div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-sm font-semibold tracking-wider text-center">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const component = row.original;
      const [openEdit, setEditOpen] = useState(false);
      const [openDelete, setDeleteOpen] = useState(false);
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setEditOpen((prev) => !prev)}
              >
                Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={() => setDeleteOpen((prev) => !prev)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditRegulatorModal
            open={openEdit}
            setOpen={setEditOpen}
            idComponent={component.id}
          />
          <DeleteRegulatorModal
            open={openDelete}
            setOpen={setDeleteOpen}
            idComponent={component.id}
          />
        </div>
      );
    },
  },
];

export { Shema };
export type { TableData };
