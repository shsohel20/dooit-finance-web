import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question from "@/views/onboarding/Question";
import React, { useState } from "react";

export default function RightProfile() {
  const [rightProfile, setRightProfile] = useState(null);
  const { setStep } = useCustomerRegisterStore();
  const handleRightChange = async (src) => {
    setRightProfile(src);
  };
  const handleContinue = () => {
    setStep(6);
  };
  return (
    <div>
      <Question>Front Profile</Question>
      <p className="text-sm text-gray-500 text-center">
        Please take a selfie with your face clearly visible and well-lit. No hats, masks, or
        glasses.
      </p>
      <div className="pt-4">
        {/* Right */}

        {/* <CustomDropZone
                handleChange={handleFrontChange}
                url={frontProfile || ""}
              >
                <p className="font-medium">Drag & drop or click to upload</p>
              </CustomDropZone> */}
        <FaceCapture image={rightProfile} onCapture={handleRightChange} />
        {rightProfile && (
          <Button className="w-full" onClick={handleContinue}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
