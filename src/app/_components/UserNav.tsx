"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Menu, Plus, UserCog } from "lucide-react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { AddTaskModal } from "./AddTaskModal";
import { EditProfileDialog } from "./EditProfileDialog";

type Props = {
  user: Session;
};
export function UserNav({ user }: Props) {
  const {
    user: { firstName, lastName, email, id },
  } = user;
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const isAdminUser = user.user.role === "ADMIN";

  return (
    <>
      {/* <Avatar className="h-9 w-9">
        <AvatarFallback className="uppercase">
          {firstName[0]}
          {lastName[0]}
        </AvatarFallback>
      </Avatar> */}
      <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        setIsOpen={setIsEditProfileOpen} 
        userData={{
          id,
          firstName,
          lastName,
          position: user.user.position,
        }}
      />
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger>
          <Menu className="text-black" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {firstName} {lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(false);
              setIsEditProfileOpen(true);
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
          <Link
            href="/dashboard/tasks"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <DropdownMenuItem>Tasks</DropdownMenuItem>
          </Link>
          {isAdminUser && (
            <Link
              href="/dashboard/members"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <DropdownMenuItem>Members</DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={async () => {
              await signOut();
            }}
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
