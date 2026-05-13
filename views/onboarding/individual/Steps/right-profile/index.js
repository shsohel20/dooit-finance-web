import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";

import FaceCapture from "@/views/customer-registration/common/FaceCapture";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React, { useState } from "react";
import { checkImageLiveness } from "@/app/customer/registration/actions";

export default function RightProfile() {
  const [rightProfile, setRightProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setStep } = useCustomerRegisterStore();
  const handleRightChange = async (src) => {
    setRightProfile(src);
  };
  const handleContinue = () => {
    setStep(6);
  };
  const frontProfile = localStorage.getItem("live_photo");

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      img1_base64: frontProfile.replace("data:image/jpeg;base64,", ""),
      img2_base64: rightProfile.replace("data:image/jpeg;base64,", ""),
    };
    // console.log('checkImageLiveness data', JSON.stringify(data, null, 2))
    try {
      const res = await checkImageLiveness(data);
      console.log("checkImageLiveness response", JSON.stringify(res, null, 2));

      if (res.verdict) {
        localStorage.setItem("liveness_verdict", true);
        // localStorage.setItem("live_photo", frontProfile);
        // toast.success(res.verdict);
      } else if (res.error) {
        localStorage.setItem("liveness_verdict", false);
        // toast.error(res.error);
        // setError(res.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
      setStep(6);
    }
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
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
