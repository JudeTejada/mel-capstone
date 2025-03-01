"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useSession } from "next-auth/react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { EditProjectDialog } from "./EditProjectDialog";

type Project = {
  id: string;
  title: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";
  startDate: Date;
  endDate: Date;
  priority: "LOW" | "MEDIUM" | "HIGH";
  budget: number | null;
  tags: string[];
};

export function ProjectsOverview() {
  const { data: projects, refetch } = api.projects.getAllProjects.useQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const user = useSession();
  const { toast } = useToast();

  const { mutate: deleteProject } = api.projects.deleteProject.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setIsDeleteOpen(false);
      setSelectedProject(null);
      void refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (!selectedProject) return;
    deleteProject(selectedProject.id);
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects Overview</CardTitle>
        {user.data?.user.role === "ADMIN" ? (
          <Button onClick={() => setIsCreateOpen(true)}>Create Project</Button>
        ) : (
          <div />
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.result.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                  <h3 className="text-base font-semibold sm:text-lg">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${project.priority === "HIGH" ? "bg-red-100 text-red-800" : project.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                    >
                      {project.priority}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${project.status === "COMPLETED" ? "bg-green-100 text-green-800" : project.status === "ACTIVE" ? "bg-blue-100 text-blue-800" : project.status === "ON_HOLD" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {project.status.charAt(0) +
                        project.status.slice(1).toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <span className="text-muted-foreground">Timeline:</span>
                    <span className="text-xs sm:text-sm">
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {user.data?.user.role === "ADMIN" && project.budget && (
                    <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="text-xs sm:text-sm">
                        PHP{project.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                {user.data?.user.role === "ADMIN" && (
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project);
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project);
                        setIsDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <CreateProjectDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => void refetch()}
        />

        <EditProjectDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={() => void refetch()}
          project={selectedProject}
        />

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this project? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
