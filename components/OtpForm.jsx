"use client";

import * as React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "./ui/button";
import { resendOtp, verifyOtp } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useRouter } from "next/navigation";

export function OtpForm({ email, token, cid }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const router = useRouter();
  const onSubmit = async () => {
    setIsLoading(true);
    const res = await verifyOtp({ code: value });
    console.log("res", res);
    setIsLoading(false);
    if (res.success) {
      router.push(`/auth/login?token=${token}&cid=${cid}`);
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  const handleResendOtp = async () => {
    if (email) {
      setResendLoading(true);
      const res = await resendOtp({ email: email });
      console.log("res", res);
      setResendLoading(false);
      if (res.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(res.error || "Something went wrong");
      }
    }
  };
  return (
    <div className="space-y-2 min-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Confirm OTP</CardTitle>
          <CardDescription>Enter the OTP sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid place-items-center">
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="text-center text-sm space-y-2">
              <Button
                disabled={value.length !== 6 || isLoading}
                className="w-full"
                onClick={onSubmit}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm OTP"
                )}
              </Button>
              <Button
                type="button"
                disabled={resendLoading}
                variant="outline"
                className="w-full"
                onClick={handleResendOtp}
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
