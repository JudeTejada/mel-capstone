"use client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Slider } from "~/components/ui/slider";
import type { Ticket } from "@prisma/client";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type InstallationProgressInput,
  type UpdateTicketInput,
  installationProgressSchema,
  ticketUpdateSchema,
} from "~/lib/validations/ticket";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface TicketDetailsProps {
  ticket: Ticket & {
    assignedTo: {
      firstName: string;
      lastName: string;
    } | null;
    installationProgress: {
      poleExcavation: number;
      cableLaid: number;
      napLcpMounted: number;
      poleErected: number;
      cableFixed: number;
      napLcpSpliced: number;
    } | null;
  };
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const ticketForm = useForm<UpdateTicketInput>({
    resolver: zodResolver(ticketUpdateSchema),
    defaultValues: {
      status: ticket.status,
      remarks: ticket.remarks ?? "",
      activityType: ticket.activityType ?? "",
    },
  });

  const progressForm = useForm<InstallationProgressInput>({
    resolver: zodResolver(installationProgressSchema),
    defaultValues: ticket.installationProgress ?? {
      poleExcavation: 0,
      cableLaid: 0,
      napLcpMounted: 0,
      poleErected: 0,
      cableFixed: 0,
      napLcpSpliced: 0,
    },
  });

  const updateTicketMutation = api.ticket.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket details updated successfully",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update ticket details",
        variant: "destructive",
      });
      console.error("Failed to update ticket:", error);
    },
  });

  const updateProgressMutation = api.ticket.updateProgress.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Installation progress updated successfully",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update installation progress",
        variant: "destructive",
      });
      console.error("Failed to update progress:", error);
    },
  });

  const deleteTicketMutation = api.ticket.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });
      router.push("/tickets"); // Redirect to tickets list
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete ticket",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteTicketMutation.mutate(ticket.id);
  };

  async function onTicketSubmit(data: UpdateTicketInput) {
    updateTicketMutation.mutate({
      id: ticket.id,
      data,
    });
  }

  async function onProgressSubmit(data: InstallationProgressInput) {
    updateProgressMutation.mutate({
      ticketId: ticket.id,
      data,
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {ticket.type} #{ticket.id.slice(0, 8)}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Created {format(new Date(ticket.createdAt), "PPP")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Ticket
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  ticket and all its associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">
              Ticket Details
            </CardTitle>
            {ticket.type === "INSTALLATION" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            )}
            {ticket.type === "RECTIFICATION" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            )}
          </CardHeader>
          <CardContent>
            <Form {...ticketForm}>
              <form
                onSubmit={ticketForm.handleSubmit(onTicketSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={ticketForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="DONE">Done</SelectItem>
                          <SelectItem value="ON_HOLD">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={ticketForm.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Type</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter activity type"
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={ticketForm.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter remarks"
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={updateTicketMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {updateTicketMutation.isPending
                    ? "Updating..."
                    : "Update Ticket"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {ticket.type === "INSTALLATION" && (
          <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Installation Progress
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <Form {...progressForm}>
                <form
                  onSubmit={progressForm.handleSubmit(onProgressSubmit)}
                  className="space-y-4"
                >
                  {[
                    {
                      name: "poleExcavation" as const,
                      label: "Pole Excavation",
                    },
                    { name: "cableLaid" as const, label: "Cable Laid" },
                    {
                      name: "napLcpMounted" as const,
                      label: "NAP/LCP Mounted",
                    },
                    { name: "poleErected" as const, label: "Pole Erected" },
                    { name: "cableFixed" as const, label: "Cable Fixed" },
                    {
                      name: "napLcpSpliced" as const,
                      label: "NAP/LCP Spliced",
                    },
                  ].map((field) => (
                    <FormField
                      key={field.name}
                      control={progressForm.control}
                      name={field.name}
                      render={({ field: { value, onChange, ...props } }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-base">
                              {field.label}
                            </FormLabel>
                            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                              {value}%
                            </span>
                          </div>
                          <FormControl>
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals: number[]) =>
                                onChange(vals[0])
                              }
                              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="submit"
                    disabled={updateProgressMutation.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {updateProgressMutation.isPending
                      ? "Updating..."
                      : "Update Progress"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
