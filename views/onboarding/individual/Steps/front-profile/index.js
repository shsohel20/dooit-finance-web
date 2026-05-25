import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React, { useState } from "react";
import { onboardingPrimaryButtonClass } from "../../onboardingStyles";
import { base64ToFile } from "@/lib/utils";
import { fileUploadOnCloudinary } from "@/app/actions";
import { toast } from "sonner";

export default function FrontProfile() {
  const [frontProfile, setFrontProfile] = useState(null);
  const [frontProfileUrl, setFrontProfileUrl] = useState(null);
  const { setStep } = useCustomerRegisterStore();
  const handleFrontChange = async (src) => {
    setFrontProfile(src);
    const file = base64ToFile(src);
    const response = await fileUploadOnCloudinary(file);
    if (response.success) {
      setFrontProfile(response.file.publicUrl);
    }
  };
  const handleContinue = () => {
    localStorage.setItem("live_photo", frontProfileUrl);
    setStep((prev) => prev + 1);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Front profile</Question>
        <QuestionDescription preset="individual">
          Take a selfie with your face clearly visible and well-lit. No hats, masks, or glasses.
        </QuestionDescription>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-6">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50">
          <FaceCapture image={frontProfile} onCapture={handleFrontChange} />
        </div>
        {frontProfile && (
          <Button
            variant="onboarding"
            className={onboardingPrimaryButtonClass}
            onClick={handleContinue}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
