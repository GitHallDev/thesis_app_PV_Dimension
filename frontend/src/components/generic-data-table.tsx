import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Search, FilterX } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const GenericDataTable = (props: any) => {
  const {
    filteredData,
    clearAllFilters,
    columns,
    activeFiltersCount,
    globalFilter,
    setGlobalFilter,
    isLoading,
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4 ">
      <div className="flex items-center justify-between overflow-auto">
        <div className="flex items-center space-x-2 flex-1 max-w-[300px] ">
          <div className="relative">
            <div className="flex  gap-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher ..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                style={{ paddingLeft: 25 }}
                size={60}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Colonnes
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""}{" "}
                actif{activeFiltersCount > 1 ? "s" : ""}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 bg-transparent text-destructive border-destructive hover:cursor-pointer"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Effacer tout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-primary-foreground shadow-sm">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-primary-foreground"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6 py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text"
                >
                  Chargement...
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-secondary transition-colors hover:rounded-lg"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text"
                  >
                    Aucun résultat trouvé.
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Lignes par page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            >
              {"<"}
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Page</span>
            <span className="font-medium text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <span>sur</span>
            <span className="font-medium text-foreground">
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={
                !table.getCanNextPage()
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={
                !table.getCanNextPage()
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GenericDataTable;
