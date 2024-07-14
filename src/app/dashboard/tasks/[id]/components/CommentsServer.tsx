import { api } from "~/trpc/server";
import { CommentsSection } from "./CommentsSection";

export async function CommentsServer({ taskId }: { taskId: string }) {
  const data = await api.tasks.getAllCommentsByTaskID(taskId);

  return <CommentsSection taskId={taskId} comments={data.data} />;
}
