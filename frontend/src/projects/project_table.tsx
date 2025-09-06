"use client";

import { useState, useMemo } from "react";
import { createColumns, type TableData } from "./columns";
import type { FilterConfig, FilterValue } from "@/components/table-filters";
import GenericDataTable from "@/components/generic-data-table";

interface DataTableProps {
  data: TableData[];
  customFilterFunction?: (
    data: TableData[],
    filters: Record<string, FilterValue>,
    globalFilter: string
  ) => TableData[];
  filterConfigs?: Record<string, FilterConfig>;
  isLoading?: any;
}

export function ProjectDataTable({
  data,
  customFilterFunction,
  filterConfigs,
  isLoading,
}: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});

  const filteredData = useMemo(() => {
    if (customFilterFunction) {
      return customFilterFunction(data, filters, globalFilter);
    }

    return data.filter((row) => {
      // Global filter
      if (globalFilter) {
        const searchValue = globalFilter.toLowerCase();
        const matchesGlobal = Object.values(row as any).some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );
        if (!matchesGlobal) return false;
      }
      // console.log("filters Data: ", filters);
      // Column-specific filters
      for (const [columnId, filterValue] of Object.entries(filters)) {
        if (
          !filterValue ||
          Object.values(filterValue).every(
            (v) =>
              v === null ||
              v === undefined ||
              v === "" ||
              (Array.isArray(v) && v.length === 0)
          )
        )
          continue;
        console.log("filter value: ", filterValue);
        const cellValue = (row as any)[columnId];
        const config = filterConfigs?.[columnId];

        if (!config) continue;

        switch (config.type) {
          case "text":
            if (filterValue.text && filterValue.text.trim()) {
              console.log("filtre type text", filterValue.text);

              if (
                !String(cellValue)
                  .toLowerCase()
                  .includes(filterValue.text.toLowerCase())
              ) {
                return false;
              }
            }
            break;

          case "number":
            if (
              filterValue.number &&
              (filterValue.number.min !== "" || filterValue.number.max !== "")
            ) {
              console.log("filtre type number", filterValue.number);

              const numValue = Number(cellValue);
              if (
                filterValue.number.min !== "" &&
                numValue < Number(filterValue.number.min)
              )
                return false;
              if (
                filterValue.number.max !== "" &&
                numValue > Number(filterValue.number.max)
              )
                return false;
            }
            break;

          case "enum":
            if (filterValue.enum && filterValue.enum.length > 0) {
              if (!filterValue.enum.includes(String(cellValue))) return false;
            }
            break;

          case "boolean":
            console.log("filtre type boolean", filterValue.boolean);
            if (filterValue.boolean !== undefined) {
              if (cellValue !== filterValue.boolean) return false;
            }
            break;
        }
      }

      return true;
    });
  }, [data, globalFilter, filters, customFilterFunction, filterConfigs]);

  const handleFilterChange = (columnId: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setGlobalFilter("");
  };
  const columns = createColumns(filters, handleFilterChange);

  const activeFiltersCount =
    Object.values(filters).filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        !Object.values(value).every((v) => v === "") &&
        !(Array.isArray(value) && value.length === 0)
    ).length + (globalFilter ? 1 : 0);

  return (
    <GenericDataTable
      filteredData={filteredData}
      clearAllFilters={clearAllFilters}
      isLoading={isLoading}
      columns={columns}
      activeFiltersCount={activeFiltersCount}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
    />
  );
}
