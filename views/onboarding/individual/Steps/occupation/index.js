import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import { onboardingInputClass, onboardingPrimaryButtonClass } from "../../onboardingStyles";
import { customerOnboardingStepTracking } from "@/app/customer/onboarding/action";

export default function Occupation({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const token = localStorage.getItem("invite_token");
    const occupation = form.watch("occupation");
    setLoading(true);
    const payload = {
      token: token,
      step: "occupation",
      status: "submitted",
      data: {
        occupation: occupation,
      },
      note: "",
      rejectionReason: "",
      provider: "",
      providerRef: null,
    };
    const response = await customerOnboardingStepTracking(payload);
    console.log("response", response);
    setLoading(false);
    form.setValue("occupation", form.watch("occupation"));
    setStep(8);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">What is your occupation?</Question>
        <QuestionDescription preset="individual">
          We need to know your occupation to verify your identity.
        </QuestionDescription>
        <Input
          className={onboardingInputClass}
          placeholder="Enter your occupation"
          value={form.watch("occupation")}
          onChange={(e) => form.setValue("occupation", e.target.value)}
        />
      </div>
      <Button
        variant="onboarding"
        onClick={handleContinue}
        className={onboardingPrimaryButtonClass}
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue"}
      </Button>
    </div>
  );
}
