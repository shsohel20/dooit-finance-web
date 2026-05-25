import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React, { useState } from "react";
import { checkImageLiveness } from "@/app/customer/registration/actions";
import { onboardingPrimaryButtonClass } from "../../onboardingStyles";
import { base64ToFile } from "@/lib/utils";
import { fileUploadOnCloudinary } from "@/app/actions";

export default function RightProfile() {
  const [rightProfile, setRightProfile] = useState(null);
  const [rightProfileUrl, setRightProfileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setStep } = useCustomerRegisterStore();
  const handleRightChange = async (src) => {
    setRightProfile(src);
    const file = base64ToFile(src);
    const response = await fileUploadOnCloudinary(file);
    if (response.success) {
      setRightProfileUrl(response.file.publicUrl);
    }
  };
  const frontProfile = localStorage.getItem("live_photo");
  const token = localStorage.getItem("invite_token");
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      token: token,

      documents: [
        {
          url: frontProfile,
          docType: "selfie",
        },
        {
          url: rightProfileUrl,
          docType: "liveness",
        },
      ],
      note: "",
    };
    const data = {
      img1_base64: frontProfile.replace("data:image/jpeg;base64,", ""),
      img2_base64: rightProfile.replace("data:image/jpeg;base64,", ""),
    };
    try {
      const res = await checkImageLiveness(payload);
      console.log("checkImageLiveness response", JSON.stringify(res, null, 2));

      // if (res.verdict) {
      //   localStorage.setItem("liveness_verdict", true);
      // } else if (res.error) {
      //   localStorage.setItem("liveness_verdict", false);
      // }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
      setStep(6);
    }
  };

  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Right profile</Question>
        <QuestionDescription preset="individual">
          Turn your head to the right slightly and hold that position.
        </QuestionDescription>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-6">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50">
          <FaceCapture image={rightProfile} onCapture={handleRightChange} />
        </div>
        {rightProfile && (
          <Button
            variant="onboarding"
            className={onboardingPrimaryButtonClass}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        )}
      </div>
    </div>
  );
}
