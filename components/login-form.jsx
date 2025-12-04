"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import SocialLogin from "./SocialLogin";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function LoginForm({ className, token, cid, ...props }) {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  console.log("login page session", session);
  useEffect(() => {
    if (session.data) {
      if (session.data?.user?.userType === "dooit") {
        router.replace("/dashboard/admin");
      } else if (session.data?.user?.userType === "client" || "branch") {
        router.replace("/dashboard/client");
      } else if (session.data.user.role === "customer" && token) {
        router.replace("/auth/registration-type");
      } else {
        router.replace("/");
      }
    } else {
      // router.push("/auth/login");
    }
  }, [session.data?.user?.userType]);
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    const user = res.user;

    if (res.error) {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <SocialLogin />

              <div className="grid gap-6">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={field.value}
                        {...field}
                        error={errors.email?.message}
                      />
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...field}
                        error={errors.password?.message}
                      />
                    </div>
                  )}
                />
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="underline underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
