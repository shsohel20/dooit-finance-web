import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
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
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>Right Profile</Question>
        <QuestionDescription className="text-sm text-gray-500 text-center">
          Turn your head to the right and hold that position.
        </QuestionDescription>
      </div>
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
          <div className="">
            <Button className="w-full" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
