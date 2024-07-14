import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { priorities, statuses } from "../data";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import Link from "next/link";
import { CommentsServer } from "./components/CommentsServer";
import { Suspense } from "react";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = params;
  const { task } = await api.tasks.getTaskById(id);

  if (!task) return redirect("/dashboard");
  const {
    assignedId,
    createdAt,
    assigned,
    deadline,
    description,
    id: taskId,
    priority,
    status,
    title,
  } = task;

  const currentStatus = statuses.find((cur) => cur.value === status)!;

  const curPriority = priorities.find((item) => item.value === priority)!;

  return (
    <div>
      <div className="grid w-full grid-cols-1 md:grid-cols-4">
        <div className="col-span-3 bg-white">
          <Link href={"/dashboard/tasks"} className="flex md:hidden">
            <Button variant="link" className="p-0 text-gray-500">
              <ArrowLeft size={20} className="mr-1" />
              Go back
            </Button>
          </Link>

          <div className="mb-6 grid grid-cols-2 gap-y-4 md:hidden">
            <SidebarItem
              title={"Date started"}
              description={format(new Date(createdAt), "MMMM dd, yyyy")}
            />
            <SidebarItem
              title={"Priority"}
              description={
                <div className="flex items-center gap-x-2">
                  <span>{currentStatus.label}</span>
                </div>
              }
            />

            <SidebarItem
              title={"Deadline"}
              description={format(new Date(deadline), "MMMM dd, yyyy")}
            />
            <SidebarItem
              title={"Priority"}
              description={
                <div className="flex items-center">
                  <span>{curPriority.label}</span>
                </div>
              }
            />
            <SidebarItem
              title={"Assignee"}
              description={
                <div className="flex items-center gap-x-2">
                  <Avatar>
                    <AvatarFallback className="h-9 w-9 uppercase">
                      {assigned.firstName[0]}
                      {assigned.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h5 className="text-base font-medium">
                    {assigned.firstName}&nbsp;
                    {assigned.lastName}
                  </h5>
                </div>
              }
            />
          </div>

          <Link href={"/dashboard/tasks"} className="hidden md:flex">
            <Button variant="link" className="p-0 text-gray-500">
              <ArrowLeft size={20} className="mr-1" />
              Go back
            </Button>
          </Link>
          <h3 className="mb-4 text-2xl font-bold md:text-4xl">{title}</h3>
          <p
            className="text-base"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>

          <Suspense fallback="loading">
            <CommentsServer taskId={id} />
          </Suspense>
        </div>
        <div className="col-span-1 hidden flex-col space-y-4 md:flex">
          <SidebarItem
            title={"Date started"}
            description={format(new Date(createdAt), "MMMM dd, yyyy")}
          />
          <SidebarItem
            title={"Priority"}
            description={
              <div className="flex items-center gap-x-2">
                <span>{currentStatus.label}</span>
              </div>
            }
          />

          <SidebarItem
            title={"Deadline"}
            description={format(new Date(deadline), "MMMM dd, yyyy")}
          />
          <SidebarItem
            title={"Priority"}
            description={
              <div className="flex items-center">
                <span>{curPriority.label}</span>
              </div>
            }
          />
          <SidebarItem
            title={"Assignee"}
            description={
              <div className="flex items-center gap-x-2">
                <Avatar>
                  <AvatarFallback className="h-9 w-9 uppercase">
                    {assigned.firstName[0]}
                    {assigned.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h5 className="text-base font-medium">
                  {assigned.firstName}&nbsp;
                  {assigned.lastName}
                </h5>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  description,
  title,
}: {
  title: string;
  description: string | React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-x-3">
      <h4 className="text-base font-light opacity-85">{title}</h4>
      <p className="text-lg">{description}</p>
    </div>
  );
}
