"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "~/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import type { User } from "@prisma/client";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "assigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div className="w-auto">
        {
          <div className="flex items-center gap-x-2">
            <Avatar>
              <AvatarFallback className="h-9 w-9">
                <AvatarFallback className="uppercase">
                  {row.original.firstName[0]}
                  {row.original.lastName[0]}
                </AvatarFallback>
              </AvatarFallback>
            </Avatar>
            <h5 className="text-base font-medium">
              {row.original.firstName}&nbsp;
              {row.original.lastName}
            </h5>
          </div>
        }
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
