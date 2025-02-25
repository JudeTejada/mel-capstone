"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { EditTaskModal } from "~/app/_components/EditTaskModal";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Spinner } from "~/app/ui";
import { Task } from "@prisma/client";
import type { IEditTaskSchema } from "~/validation/task";

type Props = {
  taskData: IEditTaskSchema;
};

export function TaskActions({ taskData }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: deleteTask, isPending: isDeleting } =
    api.tasks.deleteTask.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Task deleted successfully",
          variant: "default",
        });
        router.push("/dashboard/tasks");
        router.refresh();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      },
    });

  const handleDelete = () => {
    deleteTask({ id: taskData.id });
  };

  return (
    <div className="flex items-center gap-x-2">
      <EditTaskModal
        taskData={taskData}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
      />
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Button
          variant="destructive"
          size="sm"
          className="text-sm"
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner className="h-4 w-4" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
