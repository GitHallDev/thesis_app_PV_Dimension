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
import EditPvModuleModal from "./edit_pv_module_modal";
import DeletePvModuleModal from "./delete_pv_module_modal";

const Shema = z.object({
  id: z.string().nullable(),
  fabricant: z.string().min(1, "Le fabricant est obligatoire"),
  model: z.string().min(1, "Le modèle est obligatoire"),
  technologie: z.enum([
    "Monocristallin",
    "Polycristallin",
    "CIS/CIGS",
    "CdTe",
    "Organique",
  ]),
  puissance_crete: z.number().positive("La puissance doit être positive"),
  tension_puissance_maximale: z.number().positive().optional().nullable(),
  courant_puissance_maximale: z.number().positive().optional().nullable(),
  tension_a_vide: z.number().positive().optional().nullable(),
  courant_court_circuit: z.number().positive().optional().nullable(),
  tolerance_puissance: z.number().positive().optional().nullable(),
  nombre_cellule: z.number().int().optional().optional().nullable(),
  dimension_module_longueur: z.number().positive().optional().nullable(),
  dimension_module_largeur: z.number().positive().optional().nullable(),
  dimension_module_hauteur: z.number().positive().optional().nullable(),
  coefficient_temperature_courant: z.number().optional().nullable(),
  coefficient_temperature_tension: z.number().optional().nullable(),
  coefficient_temperature_puissance: z.number().optional().nullable(),
  plage_temperature_fonctionnement: z.string().optional().nullable(),
  poids_module: z.number().positive().optional().nullable(),
  rendement_cellule: z.number().min(0).max(100).optional().nullable(),
  rendement_module: z.number().min(0).max(100),
  condition_standard_test: z.string().optional().optional().nullable(),
  prix: z.number().optional().nullable(),
});

type TableData = z.infer<typeof Shema>;

export const filterConfigs: Record<string, FilterConfig> = {
  fabricant: { type: "text" },
  model: { type: "text" },
  technologie: {
    type: "enum",
    options: [
      "Monocristallin",
      "Polycristallin",
      "CIS/CIGS",
      "CdTe",
      "Organique",
    ],
  },
  puissance_crete: { type: "number" },
  tension_puissance_maximale: { type: "number" },
  courant_puissance_maximale: { type: "number" },
  tension_a_vide: { type: "number" },
  courant_court_circuit: { type: "number" },
  tolerance_puissance: { type: "number" },
  nombre_cellule: { type: "number" },
  dimension_module_longueur: { type: "number" },
  dimension_module_largeur: { type: "number" },
  dimension_module_hauteur: { type: "number" },
  coefficient_temperature_courant: { type: "number" },
  coefficient_temperature_tension: { type: "number" },
  coefficient_temperature_puissance: { type: "number" },
  plage_temperature_fonctionnement: { type: "number" },
  poids_module: { type: "number" },
  rendement_cellule: { type: "number" },
  rendement_module: { type: "number" },
  condition_standard_test: { type: "number" },
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
      <div className="font-medium text">{row.getValue("fabricant") ?? "-"}</div>
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
      <div className="font-medium text">{row.getValue("model") ?? "-"}</div>
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
    accessorKey: "puissance_crete",
    id: "puissance_crete",
    header: ({ column }) => (
      <FilterableHeader
        title="Pmax (W)"
        column={column}
        columnId="puissance_crete"
        config={filterConfigs.puissance_crete}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("puissance_crete") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "tension_puissance_maximale",
    id: "tension_puissance_maximale",
    header: ({ column }) => (
      <FilterableHeader
        title="Vmp (V)"
        column={column}
        columnId="tension_puissance_maximale"
        config={filterConfigs.tension_puissance_maximale}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("tension_puissance_maximale") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "courant_puissance_maximale",
    id: "courant_puissance_maximale",
    header: ({ column }) => (
      <FilterableHeader
        title="Imp (A)"
        column={column}
        columnId="courant_puissance_maximale"
        config={filterConfigs.courant_puissance_maximale}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("courant_puissance_maximale") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "tension_a_vide",
    id: "tension_a_vide",
    header: ({ column }) => (
      <FilterableHeader
        title="VoC (V)"
        column={column}
        columnId="tension_a_vide"
        config={filterConfigs.tension_a_vide}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("tension_a_vide") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "courant_court_circuit",
    id: "courant_court_circuit",
    header: ({ column }) => (
      <FilterableHeader
        title="Isc (A)"
        column={column}
        columnId="courant_court_circuit"
        config={filterConfigs.courant_court_circuit}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("courant_court_circuit") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "rendement_module",
    id: "rendement_module",
    header: ({ column }) => (
      <FilterableHeader
        title="Rendement (%)"
        column={column}
        columnId="rendement_module"
        config={filterConfigs.rendement_module}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("rendement_module") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "tolerance_puissance",
    id: "tolerance_puissance",
    header: ({ column }) => (
      <FilterableHeader
        title="Tolérance"
        column={column}
        columnId="tolerance_puissance"
        config={filterConfigs.tolerance_puissance}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("tolerance_puissance")
          ? `± ${row.getValue("tolerance_puissance")} %`
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "coefficient_temperature_puissance",
    id: "coefficient_temperature_puissance",
    header: ({ column }) => (
      <FilterableHeader
        title="Temp.Coef.(P)"
        column={column}
        columnId="coefficient_temperature_puissance"
        config={filterConfigs.coefficient_temperature_puissance}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("coefficient_temperature_puissance")
          ? `${row.getValue("coefficient_temperature_puissance")} %/°C`
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "coefficient_temperature_tension",
    id: "coefficient_temperature_tension",
    header: ({ column }) => (
      <FilterableHeader
        title="Temp.Coef.(V)"
        column={column}
        columnId="coefficient_temperature_tension"
        config={filterConfigs.coefficient_temperature_tension}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("coefficient_temperature_tension")
          ? `${row.getValue("coefficient_temperature_tension")} mV/°C`
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "coefficient_temperature_courant",
    id: "coefficient_temperature_courant",
    header: ({ column }) => (
      <FilterableHeader
        title="Temp.Coef.(I)"
        column={column}
        columnId="coefficient_temperature_courant"
        config={filterConfigs.coefficient_temperature_courant}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("coefficient_temperature_courant")
          ? `${row.getValue("coefficient_temperature_courant")} mA/°C`
          : "-"}
      </div>
    ),
  },

  // {
  //   accessorKey: "status",
  //   id: "status",
  //   header: ({ column }) => (
  //     <FilterableHeader
  //       title="Status"
  //       column={column}
  //       columnId="status"
  //       config={filterConfigs.status}
  //       filters={filters}
  //       onFilterChange={onFilterChange}
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as boolean;
  //     return (
  //       <div className="flex justify-center">
  //         <Badge
  //           className={`${
  //             status
  //               ? "bg-green-100 text-green-800 border-green-200"
  //               : "bg-red-100 text-red-800 border-red-200"
  //           }`}
  //         >
  //           {status ? "Actif" : "Inactif"}
  //         </Badge>
  //       </div>
  //     );
  //   },
  // },
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
          <EditPvModuleModal
            open={openEdit}
            setOpen={setEditOpen}
            idComponent={component.id}
          />
          <DeletePvModuleModal
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
