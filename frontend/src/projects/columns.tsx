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
import {
  ArrowUpDown,
  Eye,
  Filter,
  FilterX,
  MoreHorizontal,
} from "lucide-react";
import { z } from "zod";
import {
  FilterComponent,
  type FilterConfig,
  type FilterValue,
} from "@/components/table-filters";
import { useState } from "react";
import { ProjectDetailsSheet } from "./details_project_sheet";
// import EditRegulatorModal from "./edit_regulator_modal";
// import DeleteRegulatorModal from "./delete_regulator_modal";

const Shema = z.object({
  id: z.string().nullable(),
  profil_url: z.string().nullable(),
  project_name: z.string().nonempty("Le nom du projet est obligatoire"),
  customer_name: z.string(),
  location_name: z.string().nonempty("Le nom du site est obligatoire"),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  hauteur: z.number(),
  status: z.enum(["En cours", "Terminé"]),
});

type TableData = z.infer<typeof Shema>;

export const filterConfigs: Record<string, FilterConfig> = {
  project_name: { type: "text" },
  profil_url: { type: "text" },
  customer_name: { type: "text" },
  location_name: { type: "text" },
  longitude: { type: "number" },
  latitude: { type: "number" },
  hauteur: { type: "number" },
  poids: { type: "number" },
  prix: { type: "number" },
  status: { type: "enum", options: ["En cours", "Terminé"] },
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
    accessorKey: "project_name",
    id: "project_name",
    header: ({ column }) => (
      <FilterableHeader
        title="Nom"
        column={column}
        columnId="project_name"
        config={filterConfigs.project_name}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center">
        {row.getValue("project_name") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "customer_name",
    id: "customer_name",
    header: ({ column }) => (
      <FilterableHeader
        title="Client"
        column={column}
        columnId="customer_name"
        config={filterConfigs.customer_name}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center ">
        {row.getValue("customer_name") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "longitude",
    id: "longitude",
    header: ({ column }) => (
      <FilterableHeader
        title="Longitude"
        column={column}
        columnId="longitude"
        config={filterConfigs.longitude}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center ">
        {row.getValue("longitude") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "latitude",
    id: "latitude",
    header: ({ column }) => (
      <FilterableHeader
        title="Latitude"
        column={column}
        columnId="latitude"
        config={filterConfigs.latitude}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center ">
        {row.getValue("latitude") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "hauteur",
    id: "hauteur",
    header: ({ column }) => (
      <FilterableHeader
        title="Hauteur"
        column={column}
        columnId="hauteur"
        config={filterConfigs.hauteur}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center ">
        {row.getValue("hauteur") ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <FilterableHeader
        title="Status"
        column={column}
        columnId="status"
        config={filterConfigs.status}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") === "En cours";
      return (
        <div className="flex justify-center">
          <Badge
            className={`${
              status
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }`}
          >
            {row.getValue("status")}
          </Badge>
        </div>
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
      const project = row.original;
      const [openEdit, setEditOpen] = useState(false);
      const [openDelete, setDeleteOpen] = useState(false);
      const [openDetail, setDetailOpen] = useState(false);
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
              <DropdownMenuItem onClick={()=>setDetailOpen((prev)=>!prev)} className="hover:bg-transparent hover:text-primary">
                <Eye className="h-4 w-4 mr-1" />
                Voir détails
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={() => setDeleteOpen((prev) => !prev)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ProjectDetailsSheet
            open={openDetail}
            setOpen={setDetailOpen}
            projectId={project.id}
          />
          {/* <EditRegulatorModal
            open={openEdit}
            setOpen={setEditOpen}
            idComponent={component.id}
          /> */}
          {/* <DeleteRegulatorModal
            open={openDelete}
            setOpen={setDeleteOpen}
            idComponent={component.id}
          /> */}
        </div>
      );
    },
  },
];

export { Shema };
export type { TableData };
