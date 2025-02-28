"use client";
import React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { Spinner } from "../ui";
import { useRouter } from "next/navigation";

// Define the schema for profile editing
const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  position: z.string().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    position?: string;
  };
};

export function EditProfileDialog({ isOpen, setIsOpen, userData }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const { handleSubmit, control, formState: { errors } } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      position: userData.position || "",
    },
  });

  // Create a mutation for updating the user profile
  const { mutate, isPending } = api.users.updateProfile.useMutation({
    onSuccess: () => {
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    },
  });

  const onSubmit: SubmitHandler<EditProfileFormData> = (data) => {
    mutate({
      id: userData.id,
      ...data,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...field}
                  className={errors.firstName ? "border-red-500" : ""}
                />
              )}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...field}
                  className={errors.lastName ? "border-red-500" : ""}
                />
              )}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Input
                  id="position"
                  placeholder="Enter your position"
                  {...field}
                />
              )}
            />
          </div>

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