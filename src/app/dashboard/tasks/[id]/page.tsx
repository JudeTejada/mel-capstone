import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, ClockIcon, FlagIcon, ClipboardIcon, ClockIcon as TimeIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { priorities, statuses } from "../data";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import Link from "next/link";
import { CommentsServer } from "./components/CommentsServer";
import { Suspense } from "react";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/app/ui";
import { TaskActions } from "./components/TaskActions";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = params;
  const { task } = await api.tasks.getTaskById(id);

  if (!task) return redirect("/dashboard");
  const {
    assignees,
    createdAt,
    deadline,
    description,
    id: taskId,
    priority,
    status,
    title,
    project,
    estimatedHours,
    actualHours
  } = task;

  const currentStatus = statuses.find((cur) => cur.value === status)!;
  const curPriority = priorities.find((item) => item.value === priority)!;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-4">
        <div className="col-span-3 rounded-lg bg-white p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <Link href={"/dashboard/tasks"} className="flex">
              <Button variant="link" className="p-0 text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} className="mr-1" />
                Go back
              </Button>
            </Link>
            {/* <TaskActions
              taskData={{
                id: taskId,
                title,
                description,
                deadline,
                priority,
                status,
                assigneeIds: assignees.map(a => a.id),
                projectId: project.id,
                estimatedHours,
                actualHours
              }}
            /> */}
          </div>

          <div className="mb-8">
            <h3 className="text-xl md:text-2xl lg:text-4xl font-bold tracking-tight mb-4">{title}</h3>
            <div className="prose max-w-none">
              <div
                className="text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>

          <div className="border-t pt-8">
            <Suspense fallback={<div className="mt-8 flex items-center justify-center"><Spinner /></div>}>
              <CommentsServer taskId={id} />
            </Suspense>
          </div>
        </div>

        <div className="col-span-1 flex flex-col space-y-6 rounded-lg bg-white p-4 md:p-6 shadow-sm order-first md:order-last">
          <h4 className="text-lg font-semibold mb-4">Task Details</h4>

          <div className="space-y-6 border-b pb-6">
            <SidebarItem
              title={"Project"}
              description={project.title}
              icon={<ClipboardIcon className="h-5 w-5 text-gray-500" />}
            />
            <SidebarItem
              title={"Date started"}
              description={format(new Date(createdAt), "MMMM dd, yyyy")}
              icon={<CalendarIcon className="h-5 w-5 text-gray-500" />}
            />
            <SidebarItem
              title={"Deadline"}
              description={format(new Date(deadline), "MMMM dd, yyyy")}
              icon={<CalendarIcon className="h-5 w-5 text-gray-500" />}
            />
          </div>

          <div className="space-y-6 border-b pb-6">
            <SidebarItem
              title={"Status"}
              description={
                <Badge variant="secondary" className={`${currentStatus.value === 'COMPLETED' ? 'bg-green-100 text-green-800' : currentStatus.value === 'INPROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {currentStatus.label}
                </Badge>
              }
              icon={<ClockIcon className="h-5 w-5 text-gray-500" />}
            />
            <SidebarItem
              title={"Priority"}
              description={
                <Badge variant="secondary" className={`${curPriority.value === 'HIGH' ? 'bg-red-100 text-red-800' : curPriority.value === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {curPriority.label}
                </Badge>
              }
              icon={<FlagIcon className="h-5 w-5 text-gray-500" />}
            />
          </div>

          <div className="space-y-6 border-b pb-6">
            <SidebarItem
              title={"Estimated Hours"}
              description={`${estimatedHours} hours`}
              icon={<TimeIcon className="h-5 w-5 text-gray-500" />}
            />
            <SidebarItem
              title={"Actual Hours"}
              description={`${actualHours ?? 0} hours`}
              icon={<TimeIcon className="h-5 w-5 text-gray-500" />}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Assignees</h4>
            <div className="flex flex-wrap gap-4">
              {assignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-x-2">
                  <Avatar className="border-2 border-gray-100">
                    <AvatarFallback className="h-9 w-9 bg-primary/10 uppercase text-primary">
                      {assignee.firstName[0]}
                      {assignee.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h5 className="text-base font-medium">
                    {assignee.firstName}&nbsp;
                    {assignee.lastName}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  description,
  title,
  icon,
}: {
  title: string;
  description: string | React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-x-3">
      {icon}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
        <div className="text-base">{description}</div>
      </div>
    </div>
  );
}
