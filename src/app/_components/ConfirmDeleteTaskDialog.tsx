"use client";
import { revalidatePath } from "next/cache";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";
import { Spinner } from "../ui";
import { useRouter } from "next/navigation";
import { toast } from "~/components/ui/use-toast";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
};
export function ConfirmDeleteTaskDialog({ open, setOpen, taskId }: Props) {
  const router = useRouter();

  const { mutate, isPending } = api.tasks.deleteTask.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Success",
        description: "Task deleted successfully",
        variant: "default",
      });
      revalidatePath("/dashboard/tasks");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate({ id: taskId })}>
            {isPending ? <Spinner /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
