import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-center md:justify-between px-4 py-4 bg-white border-t">
      <div className="hidden md:flex flex-1 text-sm font-medium text-gray-700">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="hidden md:flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-700">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[70px] border-gray-200">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[5rem]">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-9 w-9 p-0 lg:flex border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Go to first page"
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Go to previous page"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Go to next page"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 lg:flex border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            title="Go to last page"
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
