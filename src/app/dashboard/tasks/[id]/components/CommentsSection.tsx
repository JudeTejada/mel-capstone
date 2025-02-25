"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "~/app/ui";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import type { GetAllCommentsByTaskIDReturnType } from "~/server/api/routers/tasks";
import { api } from "~/trpc/react";

type Props = {
  taskId: string;
  comments: GetAllCommentsByTaskIDReturnType["data"];
};

const commentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

export type ICommentSchema = z.infer<typeof commentSchema>;

export function CommentsSection({ comments, taskId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICommentSchema>({
    resolver: zodResolver(commentSchema),
  });

  const { mutate, isPending } = api.tasks.addComment.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your comment has been added",
        variant: "default",
      });
      reset();
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ICommentSchema) => {
    mutate({ taskId: taskId, text: data.comment });
  };

  return (
    <div className="mt-8 flex flex-col gap-x-4">
      <form
        className="mb-8 flex flex-col gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="flex flex-col gap-y-4 md:flex-row md:items-start md:gap-x-4">
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your thoughts or updates here..."
              className="w-full resize-none focus-visible:ring-2 focus-visible:ring-primary"
              id="comment"
              rows={4}
              {...register("comment", { required: true })}
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full transition-all hover:bg-primary/90 md:w-24"
            disabled={isPending}
          >
            {isPending ? <Spinner className="h-4 w-4" /> : "Send"}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((item, i) => (
          <div className="flex flex-col gap-y-3" key={item.id}>
            <div className="flex items-center gap-x-3">
              <Avatar className="h-8 w-8 border-2 border-gray-100">
                <AvatarFallback className="bg-primary/10 uppercase text-primary">
                  {item.user.firstName[0]}
                  {item.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-x-2">
                <span className="font-medium">
                  {item.user.firstName} {item.user.lastName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(item.createdAt), "MMMM dd, yyyy")}
                </span>
              </div>
            </div>

            <p className="pl-11 text-base text-gray-700">{item.text}</p>
            {i !== comments.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
