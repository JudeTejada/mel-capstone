import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({ children }: PropsWithChildren) {
  const user = await getServerAuthSession();
  if (user) return redirect("/dashboard");

  return <>{children}</>;
}
