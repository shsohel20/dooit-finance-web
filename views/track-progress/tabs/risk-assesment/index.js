"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import PrimarySelection from "./primary";
import ClientTypesStep, { CLIENT_TYPES } from "./primary/client-types";
import DeliveryChannelsStep from "./primary/delivery-channels";
import DesignatedServicesStep from "./primary/designated-services";
import LawyerRisk from "./primary/LawyerRisk";

const CLIENT_TYPE_RISK_STEPS = {
  "Lawyers&Conveyancers": {
    key: "lawyer_risk",
    label: "Lawyer risk factors",
    Component: LawyerRisk,
    answersKey: "lawyer_risk",
  },
  // Add other client-type risk steps here as they are built out.
};

const COMMON_STEPS = [
  {
    key: "delivery_channels",
    label: "Delivery channels",
    Component: DeliveryChannelsStep,
    answersKey: "delivery_channels",
  },
  {
    key: "designated_services",
    label: "Designated services risk factors",
    Component: DesignatedServicesStep,
    answersKey: "designated_services",
  },
  // { key: "client_risk", label: "Client risk factors", Component: null },
  // { key: "delivery_risk", label: "Delivery channel risk factors", Component: null },
  // { key: "country", label: "Country", Component: null },
];

function getSelectedClientTypes(clientTypes = {}) {
  return CLIENT_TYPES.filter((type) => clientTypes[type.key]).map((type) => type.key);
}

function buildRiskAssessmentSteps(clientTypes = {}) {
  const steps = [
    {
      key: "client_types",
      label: "Client Types",
      Component: ClientTypesStep,
      answersKey: "client_types",
    },
    {
      key: "lawyer_risk",
      label: "Lawyer risk factors",
      Component: LawyerRisk,
      answersKey: "lawyer_risk",
    },
  ];

  getSelectedClientTypes(clientTypes).forEach((clientTypeKey) => {
    const riskStep = CLIENT_TYPE_RISK_STEPS[clientTypeKey];
    if (riskStep) {
      steps.push(riskStep);
    }
  });

  return [...steps, ...COMMON_STEPS];
}

const RiskAssessmentTab = () => {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [allAnswers, setAllAnswers] = useState({});

  const steps = useMemo(
    () => buildRiskAssessmentSteps(allAnswers.client_types),
    [allAnswers.client_types],
  );

  useEffect(() => {
    if (currentStep >= steps.length) {
      setCurrentStep(Math.max(steps.length - 1, 0));
    }
  }, [currentStep, steps.length]);

  const updateAnswers = (answersKey, value) => {
    setAllAnswers((prev) => ({ ...prev, [answersKey]: value }));
  };

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    if (!step?.Component) {
      return <p className="text-muted-foreground text-sm">Coming soon…</p>;
    }

    const { Component, answersKey } = step;
    const stepAnswers = allAnswers[answersKey] ?? {};

    if (answersKey === "client_types") {
      return (
        <Component selected={stepAnswers} onChange={(value) => updateAnswers(answersKey, value)} />
      );
    }

    if (answersKey?.endsWith("_risk")) {
      return (
        <Component answers={stepAnswers} onChange={(value) => updateAnswers(answersKey, value)} />
      );
    }

    return <Component />;
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <div>
      {started ? (
        <PrimarySelection
          steps={steps}
          currentStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
          renderStep={renderCurrentStep}
        />
      ) : (
        <div className="h-[50vh] grid place-items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2">Start Your Risk Assessment</h1>
            <p className="text-gray-600 mb-6">
              Evaluate and manage risks associated with your financial activities.
            </p>
            <Button onClick={handleStart}>Let&apos;s Begin</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentTab;
