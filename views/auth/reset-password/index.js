"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/app/auth/actions";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function ResetPassword({ token }) {
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    resolver: zodResolver(
      z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters long"),
          confirmPassword: z.string().min(8, "Confirm Password is required"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    ),
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data) => {
    setIsLoading(true);

    setError("");
    const payload = {
      password: data.password,
    };
    const response = await resetPassword(payload, token);
    console.log("response", response);
    setIsLoading(false);
    if (response.success) {
      router.push("/auth/login");
      toast.success("Password reset successfully");
    } else {
      setError(response.error);
      toast.error(response?.error || "Failed to reset password");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <FormField form={form} name="password" label="New Password" type="password" />
          </div>
          <FormField form={form} name="confirmPassword" label="Confirm Password" type="password" />
          <Button onClick={form.handleSubmit(onSubmit)} type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
