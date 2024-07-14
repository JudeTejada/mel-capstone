"use client";
import { useRouter } from "next/navigation";
import { Spinner } from "~/app/ui";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";

import { api } from "~/trpc/react";
import { ILogin } from "~/validation/auth";
import Link from "next/link";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    const res = await signIn("credentials", { ...data });

  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Passowrd"
              {...register("password", { required: true })}
            />
          </div>

          <Button className="w-full">Sign in</Button>
          <Link href={"/auth/signup"}>
            <Button variant="link" className="w-full">
               Create a account?
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
