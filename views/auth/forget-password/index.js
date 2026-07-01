"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgetPassword } from "@/app/auth/actions";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const handleSubmit = async (e) => {
    //regex to check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    setError(null);
    setSuccess(null);
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      email: email,
      // url: process.env.NEXT_PUBLIC_CLIENT_URL,
      token: "",
      cid: "",
    };
    console.log("payload", JSON.stringify(payload, null, 2));
    const res = await forgetPassword(payload);
    console.log("res", res);
    setIsLoading(false);
    if (res.success) {
      toast.success(res.message);
      setSuccess(true);
    } else {
      setError(res.error);

      setSuccess(false);
    }
  };
  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">A reset link has been sent to your email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Please check your email and click the link to reset your password
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Forgot Password?</CardTitle>
        <CardDescription>Enter your email to receive a link to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <form>
          <div className="grid gap-6">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
