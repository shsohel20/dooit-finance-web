import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React, { useState, useRef } from "react";
import { onboardingPrimaryButtonClass } from "../../onboardingStyles";
import { base64ToFile } from "@/lib/utils";
import { fileUploadOnCloudinary } from "@/app/actions";
import { toast } from "sonner";

export default function FrontProfile() {
  const [frontProfile, setFrontProfile] = useState(null);
  const [frontProfileUrl, setFrontProfileUrl] = useState(null);
  const { setStep, step } = useCustomerRegisterStore();
  const [uploading, setUploading] = useState(false);
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const intervalRef = useRef(null);

  const handleFrontChange = async (src) => {
    setUploading(true);
    setUploadingPercentage(0);
    setFrontProfile(src);

    intervalRef.current = setInterval(() => {
      setUploadingPercentage((prev) => {
        if (prev >= 90) {
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev + Math.random() * 8;
      });
    }, 300);

    const file = base64ToFile(src);
    const response = await fileUploadOnCloudinary(file);
    clearInterval(intervalRef.current);
    if (response.success) {
      setUploadingPercentage(100);
      setFrontProfileUrl(response.file.publicUrl);
      setTimeout(() => setUploading(false), 400);
    }
  };
  const handleContinue = () => {
    localStorage.setItem("live_photo", frontProfileUrl);
    setStep(Number(step) + 1);
  };
  const handleSkip = () => {
    setStep(5);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div>
        <Button variant="outline" onClick={handleSkip}>
          Skip
        </Button>
      </div>
      <div className="space-y-5">
        <Question preset="individual">Front profile</Question>
        <QuestionDescription preset="individual">
          Take a selfie with your face clearly visible and well-lit. No hats, masks, or glasses.
        </QuestionDescription>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-6">
        <div className="overflow-hidden rounded-2xl px-4 border border-neutral-200 bg-neutral-50/50">
          <FaceCapture image={frontProfile} onCapture={handleFrontChange} />
        </div>
        {uploading && (
          <div className="w-full h-1.5 rounded-full bg-neutral-200 relative">
            <span className="absolute right-0 -top-5">{Math.round(uploadingPercentage)}%</span>
            <div
              className="h-full bg-black rounded-full absolute inset-0 transition-all duration-300 ease-out"
              style={{ width: `${uploadingPercentage}%` }}
            />
          </div>
        )}
        {frontProfile && (
          <Button
            variant="onboarding"
            className={onboardingPrimaryButtonClass}
            onClick={handleContinue}
            disabled={uploading}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
