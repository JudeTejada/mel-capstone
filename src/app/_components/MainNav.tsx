"use client";
import { Plus } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

import { cn } from "~/lib/utils";
import { AddTaskModal } from "./AddTaskModal";
import { useState } from "react";

export function MainNav({
  className,
  user,
  ...props
}: React.HTMLAttributes<HTMLElement> & { user: Session }) {
  const isAdminUser = user.user.role === "ADMIN";

  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/tasks"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Tasks
      </Link>
      {isAdminUser && (
        <Link
          href="/dashboard/members"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Members
        </Link>
      )}
      <AddTaskModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <button className="flex items-center text-sm font-medium transition-colors hover:text-primary">
          Add Task <Plus className="text-primary" size={20} />
        </button>
      </AddTaskModal>
    </nav>
  );
}
