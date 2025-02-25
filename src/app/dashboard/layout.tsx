import type { PropsWithChildren } from "react";
import { MainNav } from "../_components/MainNav";
import { UserNav } from "../_components/UserNav";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Page({ children }: PropsWithChildren) {
  const user = await getServerAuthSession();
  if (!user) return redirect("/auth/login");

  return (
    <>
      <div className="border-b">
        <div className="mx-auto md:container">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" user={user} />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav user={user} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 p-4 md:container md:p-8">{children}</div>
    </>
  );
}
