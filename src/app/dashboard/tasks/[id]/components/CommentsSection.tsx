"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment } from "@prisma/client";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICommentSchema>({
    resolver: zodResolver(commentSchema),
  });

  const { mutate, isPending } = api.tasks.addComment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  console.log({ comments });

  const onSubmit = (data: ICommentSchema) => {
    mutate({ taskId: taskId, text: data.comment });
  };
  return (
    <div className="mt-8 flex flex-col gap-x-4">
      <form
        className="mb-6 flex flex-col gap-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Add a comment</h3>
        <div className="mb-6 flex items-start gap-x-4">
          <Textarea
            placeholder="Add your comment here"
            className="w-3/4"
            id="comment"
            {...register("comment", { required: true })}
          />
          <Button type="submit">{isPending ? <Spinner /> : "Send"}</Button>
        </div>

        {comments.map((item, i) => (
          <div className="flex flex-col gap-y-2" key={item.id}>
            <div className="flex items-center gap-x-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="uppercase">
                  {item.user.firstName[0]}
                  {/* {lastName[0]} */}
                  {item.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span>
                {item.user.firstName} {item.user.lastName}
              </span>
              <span className="text-sm text-gray-600">
                {format(new Date(item.createdAt), "MMMM dd, yyyy")}
              </span>
            </div>

            <p className="text-base">{item.text}</p>
            {i !== comments.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </form>
    </div>
  );
}
