// src/components_manage/cellPVComponent/index.tsx
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
import EditInverterModal from "./edit_inverter_modal";
import DeleteInverterModal from "./delete_inverter_modal";

const Shema = z.object({
  id: z.string().nullable(),
  fabricant: z.string().min(1, "Le fabricant est obligatoire"),
  model: z.string().min(1, "Le modèle est obligatoire"),
  technologie: z.enum(["Hybrides", "Réseau", "Hors-réseau"]),
  puissance_nominale_AC: z.number().positive("La puissance doit être positive"),
  tension_entree_max_DC: z.number().positive().optional().nullable(),
  courant_entree_max: z.number().positive().optional().nullable(),
  plage_MPPT_min: z.number().positive().optional().nullable(),
  plage_MPPT_max: z.number().positive().optional().nullable(),
  nbr_tracker_MPPT: z.number().positive().optional().nullable(),
  rendement_max: z.number().positive().optional().nullable(),
  puissance_sortie_max: z.number().positive().optional().nullable(),
  type_sortie: z.enum(["MonoPhasé", "Biphasé", "Triphasé"]),
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
  technologie: {
    type: "enum",
    options: ["Hybrides", "Réseau", "Hors-réseau"],
  },
  puissance_nominale_AC: { type: "number" },
  tension_entree_max_DC: { type: "number" },
  courant_entree_max: { type: "number" },
  plage_MPPT_min: { type: "number" },
  plage_MPPT_max: { type: "number" },
  nbr_tracker_MPPT: { type: "number" },
  rendement_max: { type: "number" },
  puissance_sortie_max: { type: "number" },
  type_sortie: {
    type: "enum",
    options: ["MonoPhasé", "Biphasé", "Triphasé"],
  },
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
    accessorKey: "technologie",
    id: "technologie",
    header: ({ column }) => (
      <FilterableHeader
        title="Technologie"
        column={column}
        columnId="technologie"
        config={filterConfigs.technologie}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => {
      const technologie = row.getValue("technologie") as string;
      const colorMap = {
        Monocristallin: "bg-blue-100 text-blue-900",
        Polycristallin: "bg-green-100 text-green-900",
        "CIS/CIGS": "bg-yellow-100 text-yellow-900",
        CdTe: "bg-purple-100 text-purple-900",
        Organique: "bg-pink-100 text-pink-900",
      };

      return (
        <div className="flex justify-center">
          <Badge
            className={`${
              colorMap[technologie as keyof typeof colorMap]
            } border-0`}
          >
            {technologie}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "puissance_nominale_AC",
    id: "puissance_nominale_AC",
    header: ({ column }) => (
      <FilterableHeader
        title="Puissance nominale AC"
        column={column}
        columnId="puissance_nominale_AC"
        config={filterConfigs.puissance_nominale_AC}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("puissance_nominale_AC") ?? "_"}
      </div>
    ),
  },
  {
    accessorKey: "tension_entree_max_DC",
    id: "tension_entree_max_DC",
    header: ({ column }) => (
      <FilterableHeader
        title="tension entree max DC"
        column={column}
        columnId="tension_entree_max_DC"
        config={filterConfigs.tension_entree_max_DC}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("tension_entree_max_DC") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "courant_entree_max",
    id: "courant_entree_max",
    header: ({ column }) => (
      <FilterableHeader
        title="courant entree max"
        column={column}
        columnId="courant_entree_max"
        config={filterConfigs.courant_entree_max}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("courant_entree_max") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "plage_MPPT_min",
    id: "plage_MPPT_min",
    header: ({ column }) => (
      <FilterableHeader
        title="VoC (V)"
        column={column}
        columnId="plage_MPPT_min"
        config={filterConfigs.plage_MPPT_min}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("plage_MPPT_min") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "plage_MPPT_max",
    id: "plage_MPPT_max",
    header: ({ column }) => (
      <FilterableHeader
        title="Plage MPPT max"
        column={column}
        columnId="plage_MPPT_max"
        config={filterConfigs.plage_MPPT_max}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("plage_MPPT_max") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "nbr_tracker_MPPT",
    id: "nbr_tracker_MPPT",
    header: ({ column }) => (
      <FilterableHeader
        title="nbr tracker MPPT"
        column={column}
        columnId="nbr_tracker_MPPT"
        config={filterConfigs.nbr_tracker_MPPT}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("nbr_tracker_MPPT")}
      </div>
    ),
  },
  {
    accessorKey: "puissance_sortie_max",
    id: "puissance_sortie_max",
    header: ({ column }) => (
      <FilterableHeader
        title="puissance sorti emax"
        column={column}
        columnId="puissance_sortie_max"
        config={filterConfigs.puissance_sortie_max}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("puissance_sortie_max") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "type_sortie",
    id: "type_sortie",
    header: ({ column }) => (
      <FilterableHeader
        title="type sortie"
        column={column}
        columnId="type_sortie"
        config={filterConfigs.type_sortie}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => {
              const type_sortie = row.getValue("type_sortie") as string;
      const colorMap = {
        MonoPhase: "bg-blue-100 text-blue-900",
        Biphase: "bg-green-100 text-green-900",
        Triphase: "bg-yellow-100 text-yellow-900",
      };

       return (
        <Badge
          className={`${
            colorMap[type_sortie as keyof typeof colorMap]
          } border-0`}
        >
          {type_sortie}
        </Badge>
      );
    },
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
          <EditInverterModal
            open={openEdit}
            setOpen={setEditOpen}
            idComponent={component.id}
          />
          <DeleteInverterModal
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
