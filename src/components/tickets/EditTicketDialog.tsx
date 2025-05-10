"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import type { UpdateTicketInput } from "~/lib/validations/ticket";
import type { Ticket } from "@prisma/client";

type TicketType = "INSTALLATION" | "RECTIFICATION";
type ProgressStatus = "IN_PROGRESS" | "DONE" | "ON_HOLD";

interface EditTicketDialogProps {
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
  trigger?: React.ReactNode;
}

export function EditTicketDialog({ ticket, trigger }: EditTicketDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: users, isLoading: isLoadingUsers } =
    api.users.getAll.useQuery();

  const form = useForm<UpdateTicketInput>({
    resolver: zodResolver(ticketUpdateSchema),
    defaultValues: {
      type: ticket.type,
      status: ticket.status,
      remarks: ticket.remarks || "",
      userId: ticket.userId || "",
      activityType: ticket.activityType || "",
      installationProgress: ticket.installationProgress || {
        poleExcavation: 0,
        cableLaid: 0,
        napLcpMounted: 0,
        poleErected: 0,
        cableFixed: 0,
        napLcpSpliced: 0,
      },
    },
  });

  const selectedTicketType = form.watch("type");

  const updateTicket = api.ticket.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      setIsModalOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update ticket",
        variant: "destructive",
      });
    },
  });

  const activityTypes = {
    INSTALLATION: [
      "New Installation",
      "Upgrade Installation",
      "Replacement Installation",
    ],
    RECTIFICATION: [
      "High loss",
      "Sagging cable",
      "Fiber break/no power",
      "Insufficient depth of pole",
      "Wrong fiber assignment",
    ],
  };

  const onSubmit = async (data: UpdateTicketInput) => {
    updateTicket.mutate({
      id: ticket.id,
      data,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit Ticket</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Ticket Type</Label>
              <Select
                onValueChange={(value: TicketType) =>
                  form.setValue("type", value)
                }
                value={form.watch("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTALLATION">Installation</SelectItem>
                  <SelectItem value="RECTIFICATION">Rectification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedTicketType === "INSTALLATION" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pole Excavation Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...form.register("installationProgress.poleExcavation", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cable Laid Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...form.register("installationProgress.cableLaid", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NAP/LCP Mounted Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...form.register("installationProgress.napLcpMounted", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pole Erected Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...form.register("installationProgress.poleErected", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cable Fixed Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...form.register("installationProgress.cableFixed", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NAP/LCP Spliced Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...form.register("installationProgress.napLcpSpliced", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            )}

            {selectedTicketType && (
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("activityType", value)
                  }
                  value={form.watch("activityType")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes[selectedTicketType].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Select
                disabled={isLoadingUsers}
                onValueChange={(value) => form.setValue("userId", value)}
                value={form.watch("userId")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingUsers ? "Loading users..." : "Select user"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingUsers ? (
                    <div className="space-y-2 p-2">
                      <div className="h-4 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 animate-pulse rounded bg-gray-200" />
                    </div>
                  ) : (
                    users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value: ProgressStatus) =>
                  form.setValue("status", value)
                }
                value={form.watch("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input
                type="text"
                placeholder="Add remarks"
                {...form.register("remarks")}
              />
            </div>

            <Button
              type="submit"
              disabled={updateTicket.isLoading}
              className="w-full"
            >
              {updateTicket.isLoading ? "Updating..." : "Update Ticket"}
            </Button>
          </form>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
