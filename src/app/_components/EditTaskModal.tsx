"use client";
import React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { type IEditTaskSchema, taskSchema } from "~/validation/task";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui";
import { useToast } from "~/components/ui/use-toast";
import { revalidatePath } from "next/cache";

type Props = {
  taskData: IEditTaskSchema;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function EditTaskModal({ taskData, isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const { handleSubmit, control, setValue, reset } = useForm<IEditTaskSchema>({
    resolver: zodResolver(taskSchema),
    values: {
      id: taskData.id,
      deadline: taskData.deadline ?? null,
      description: taskData.description ?? "",
      priority: taskData.priority ?? undefined, // Default to a valid enum value
      title: taskData.title ?? "",
      userId: taskData.userId ?? "",
      status: taskData.status ?? undefined, // Default to a valid enum value
    },
  });

  const { data, isLoading } = api.users.getAllUsers.useQuery();

  const { mutate, error, isPending } = api.tasks.editTask.useMutation({
    onSuccess: (data) => {
      toast({ title: "Success", description: data.message });
      setIsOpen(false);
      router.refresh();
      revalidatePath("/", "layout");

      reset();
    },
  });

  const onSubmit: SubmitHandler<IEditTaskSchema> = (data) => {
    mutate({ ...data, id: taskData.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <>
            <Controller
              name="id"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input type="id" {...field} hidden name="id" />
                </>
              )}
            />
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="title" className="text-start">
                Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input id="title" {...field} className="col-span-3" />
                    {fieldState.error && (
                      <span className="col-span-4 text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="description" className="text-start">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="col-span-3">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                    {fieldState.error && (
                      <span className="col-span-4 text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="status" className="text-start">
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      onValueChange={(val: IEditTaskSchema["status"]) =>
                        setValue("status", val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="TODO">To do</SelectItem>
                          <SelectItem value="INPROGRESS">
                            In progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="col-span-4 text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="userId" className="text-start">
                Assigned To
              </Label>
              {!isLoading ? (
                <Controller
                  name="userId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        onValueChange={(val: IEditTaskSchema["userId"]) =>
                          setValue("userId", val)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>User</SelectLabel>
                            {data?.result.map((user) => (
                              <SelectItem value={user.id} key={user.id}>
                                {user.firstName} {user.lastName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <span className="col-span-4 text-red-500">
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              ) : (
                <Skeleton className="min-h-10 w-full" />
              )}
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="deadline" className="text-start">
                Deadline
              </Label>
              <Controller
                name="deadline"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(val) => {
                            if (val) {
                              setValue("deadline", val.toDateString());
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <span className="col-span-4 text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="priority" className="text-start">
                Priority
              </Label>
              <Controller
                name="priority"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      onValueChange={(val: IEditTaskSchema["priority"]) =>
                        setValue("priority", val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority</SelectLabel>
                          <SelectItem value="LOW">LOW</SelectItem>
                          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                          <SelectItem value="HIGH">HIGH</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="col-span-4 text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
