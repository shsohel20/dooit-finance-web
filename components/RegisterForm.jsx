"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import SocialLogin from "./SocialLogin";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerAction } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    userName: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // field where the error will appear
  });
export default function RegisterForm({ className, token, cid, ...props }) {
  const router = useRouter();
  const initialValues = {
    name: "",
    userName: "",
    email: "",
    password: "",

    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...rest } = data;
    const submittedData = {
      ...rest,
      role: "customer",
      userType: "customer",
    };
    const res = await registerAction(submittedData);
    console.log("res", res);
    if (res.success) {
      router.push(`/auth/otp?email=${data.email}&token=${token}&cid=${cid}`);
    }
  };
  return (
    <div
      className={cn("flex flex-col gap-6 max-w-3xl w-full ", className)}
      {...props}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <SocialLogin />
              <div className="grid gap-2">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <div className="grid ">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...field}
                        error={errors.name?.message}
                      />
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="userName"
                  render={({ field }) => (
                    <div className="grid ">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="John Doe"
                        {...field}
                        error={errors.username?.message}
                      />
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid ">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
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
                    <div className="grid ">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        {...field}
                        error={errors.password?.message}
                      />
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <div className="grid ">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="********"
                        {...field}
                        error={errors.confirmPassword?.message}
                      />
                    </div>
                  )}
                />
                <Button className="w-full" onClick={handleSubmit(onSubmit)}>
                  Register
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
