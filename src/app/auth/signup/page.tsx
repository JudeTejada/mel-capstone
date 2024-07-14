"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "~/app/ui";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, error, isPending } = api.auth.register.useMutation({
    onSuccess: () => router.push("/auth//login"),
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email") as string | null;
            const password = formData.get("password") as string | null;

            const firstName = formData.get("firstName") as string;
            const lastName = formData.get("lastName") as string;

            if (email && password) {
              mutate({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
              });
            } else {
              toast({
                title: "Error",
                description: "Email or password is missing",
              });
            }
          }}
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              type="firstName"
              name="firstName"
              id="firstName"
              placeholder="First Nme"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="lastName"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">email</Label>
            <Input type="email" name="email" id="email" placeholder="Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Passowrd"
            />
          </div>

          <Button className="w-full">
            {isPending ? <Spinner /> : "Create an account"}
          </Button>
          <Link href={"/auth/login"}>
            <Button variant="link" className="w-full">
              Already have an account?
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
