import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question from "@/views/onboarding/Question";
import React, { useState } from "react";

export default function FrontProfile() {
  const [frontProfile, setFrontProfile] = useState(null);
  const { setStep } = useCustomerRegisterStore();
  const handleFrontChange = async (src) => {
    setFrontProfile(src);
  };
  const handleContinue = () => {
    setStep(5);
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
        <FaceCapture image={frontProfile} onCapture={handleFrontChange} />
        {frontProfile && (
          <div className="px-4">
            <Button className="w-full" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
