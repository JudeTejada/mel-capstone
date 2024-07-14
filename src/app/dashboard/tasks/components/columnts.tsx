/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "~/components/ui/checkbox";

import { priorities, statuses } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Task } from "@prisma/client";

//
export const columns: ColumnDef<
  Task & {
    assigned: {
      firstName: string;
      lastName: string;
    };
  }
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "assigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned" />
    ),
    cell: ({ row }) => (
      <div className="w-auto">
        {
          <div className="flex items-center gap-x-2">
            <Avatar>
              <AvatarFallback className="h-9 w-9">
                <AvatarFallback className="uppercase">
                  {/* @ts-expect-error  value exists */}
                  {row.getValue("assigned").firstName[0]}
                  {/* @ts-expect-error  value exists */}
                  {row.getValue("assigned").lastName[0]}
                </AvatarFallback>
              </AvatarFallback>
            </Avatar>
            <h5 className="text-base font-medium">
              {/* @ts-expect-error  value exists */}
              {row.getValue("assigned")!.firstName}&nbsp;
              {/* @ts-expect-error  value exists */}
              {row.getValue("assigned").lastName}
            </h5>
          </div>
        }
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority"),
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date started" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {format(new Date(row.getValue("createdAt")), "MMMM dd, yyyy")}
        </div>
      );
    },
  },

  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deadline" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {format(new Date(row.getValue("deadline")), "MMMM dd, yyyy")}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
