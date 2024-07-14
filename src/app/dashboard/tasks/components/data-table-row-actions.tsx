"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Row } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { statuses } from "../data";
import { useState } from "react";
import { EditTaskModal } from "~/app/_components/EditTaskModal";
import type { Status, Task } from "@prisma/client";
import { api } from "~/trpc/react";
import { ConfirmDeleteTaskDialog } from "~/app/_components/ConfirmDeleteTaskDialog";
import { toast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Task;
  const router = useRouter();
  console.log(task.assignedId, "task.assignedId");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialog] = useState(false);

  const { mutate } = api.tasks.updateStatus.useMutation({
    onSuccess: (data) => {
      router.refresh();
      toast({ title: "Success", description: data.message });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
            Edit
          </DropdownMenuItem>
          <Link href={`/dashboard/tasks/${task.id}`}>
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {statuses
                  .filter((item) => item.value !== task.status)
                  .map((status) => (
                    <>
                      <DropdownMenuItem
                        onSelect={() =>
                          mutate({
                            id: task.id,
                            status: status.value as Status,
                          })
                        }
                      >
                        {status.icon && (
                          <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{status.label}</span>
                      </DropdownMenuItem>
                    </>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDeleteTaskDialog(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isModalOpen && (
        <EditTaskModal
          // @ts-expect-error  data is expected
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          taskData={{
            id: task.id,
            userId: task.assignedId,
            deadline: task.deadline.toString(),
            description: task.description!,
            priority: task.priority,
            status: task.status,
            title: task.title,
          }}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      )}
      {isDeleteTaskDialogOpen && (
        <ConfirmDeleteTaskDialog
          open={isDeleteTaskDialogOpen}
          setOpen={setIsDeleteTaskDialog}
          taskId={task.id}
        />
      )}
    </>
  );
}
