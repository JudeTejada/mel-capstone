"use client";
import { Plus } from "lucide-react";
import { type Session } from "next-auth";
import Link from "next/link";

import { cn } from "~/lib/utils";
import { AddTaskModal } from "./AddTaskModal";
import { useState } from "react";

export function MainNav({
  className,
  user,
  ...props
}: React.HTMLAttributes<HTMLElement> & { user: Session }) {

  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link href="/" className="flex items-center space-x-2">
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          TaskFlow  
        </h3>
      </Link>

      {/* <AddTaskModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <button className="flex items-center text-sm font-medium transition-colors hover:text-primary">
          Add Task <Plus className="text-primary" size={20} />
        </button>
      </AddTaskModal> */}
    </nav>
  );
}
