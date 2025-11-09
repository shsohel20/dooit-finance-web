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

export default function RegisterForm({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-6 max-w-3xl w-full border", className)}
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
                <div className="grid ">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" />
                </div>
                <div className="grid ">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" placeholder="John Doe" />
                </div>
                <div className="grid ">
                  <Label htmlFor="userType">Type</Label>
                  <Input id="username" type="text" placeholder="John Doe" />
                </div>
                <div className="grid ">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid ">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="********" />
                </div>
                <div className="grid ">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                  />
                </div>
                <Button className="w-full">Register</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
