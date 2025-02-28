"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
import { type ITaskSchema, taskSchema } from "~/validation/task";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui";
import { useToast } from "~/components/ui/use-toast";
import { revalidatePath } from "next/cache";
import { MultiSelect } from "~/components/ui/multi-select";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function AddTaskModal({ children, isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { handleSubmit, control, setValue, reset, formState } =
    useForm<ITaskSchema>({
      resolver: zodResolver(taskSchema),
      defaultValues: {
        status: "TODO",
      },
    });
  console.log(formState.errors);

  const { data: projects } = api.projects.getAllProjects.useQuery();
  const { data: users, isLoading } = api.users.getAllUsers.useQuery();

  const { mutate, isPending } = api.tasks.addTask.useMutation({
    onSuccess: (data) => {
      toast({ title: "Success", description: data.message });
      setIsOpen(false);
      router.refresh();
      revalidatePath("/dashboard/tasks");

      reset();
    },
    onError:(error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },  
  });


  const onSubmit: SubmitHandler<ITaskSchema> = (data) => {
    mutate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:w-[7 40px] w-full overflow-y-auto">
        <SheetHeader className="relative">
          <SheetTitle>Add a Task</SheetTitle>
          <SheetDescription>
            Create a new task and assign it to members
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col items-start justify-start gap-4">
            <Label htmlFor="projectId" className="text-start">
              Project
            </Label>
            {!isLoading ? (
              <Controller
                name="projectId"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      onValueChange={(val: string) =>
                        setValue("projectId", val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Projects</SelectLabel>
                          {projects?.result.map((project) => (
                            <SelectItem value={project.id} key={project.id}>
                              {project.title}
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
          <div className="flex flex-col items-start justify-start gap-4">
            <Label htmlFor="title" className="text-start">
              Title
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="title"
                    {...field}
                    className={cn(
                      "col-span-3",
                      fieldState.error &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                  />
                  {fieldState.error && (
                    <span className="col-span-4 text-red-500">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-4">
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
                      className={
                        fieldState.error
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
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
          <div className="flex flex-col items-start justify-start gap-4">
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
                    onValueChange={(val: ITaskSchema["status"]) =>
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
                        <SelectItem value="INPROGRESS">In progress</SelectItem>
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
          <div className="flex flex-col items-start justify-start gap-4">
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
                    onValueChange={(val: ITaskSchema["priority"]) =>
                      setValue("priority", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
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
          <div className="flex flex-col items-start justify-start gap-4">
            <Label htmlFor="assigneeIds" className="text-start">
              Assigned To (Optional)
            </Label>
            {!isLoading ? (
              <Controller
                name="assigneeIds"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <MultiSelect
                      options={
                        users?.result.map((user) => ({
                          label: `${user.firstName} ${user.lastName}`,
                          value: user.id,
                        })) ?? []
                      }
                      onValueChange={(val) => setValue("assigneeIds", val)}
                      defaultValue={field.value}
                      placeholder="Select assignees"
                      maxCount={3}
                      className={cn(
                        "w-full",
                        fieldState.error &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                    />
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
          <div className="flex flex-col items-start justify-start gap-4">
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
          <div className="flex flex-col items-start justify-start gap-4">
            <Label htmlFor="estimatedHours" className="text-start">
              Estimated Hours
            </Label>
            <Controller
              name="estimatedHours"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="0"
                    step="0.5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className={cn(
                      "col-span-3",
                      fieldState.error &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                  />
                  {fieldState.error && (
                    <span className="col-span-4 text-red-500">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <SheetFooter className="mt-4">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Spinner /> : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
