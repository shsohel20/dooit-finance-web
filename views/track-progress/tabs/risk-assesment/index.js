"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import PrimarySelection from "./primary";
import ClientTypesStep, { CLIENT_TYPES } from "./primary/client-types";
import DeliveryChannelsStep from "./primary/delivery-channels";
import DesignatedServicesStep from "./primary/designated-services";
import LawyerRisk from "./primary/LawyerRisk";
import { getRiskAssessmentQuestions } from "../../actions";
import { useForm } from "react-hook-form";
import RiskAssessmentSteps from "./steps";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [allAnswers, setAllAnswers] = useState({});
  const [riskAssessmentQuestions, setRiskAssessmentQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const form = useForm();

  useEffect(() => {
    const fetchRiskAssessmentQuestions = async () => {
      setLoading(true);
      try {
        const response = await getRiskAssessmentQuestions();
        console.log("response", JSON.stringify(response, null, 2));
        setRiskAssessmentQuestions(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchRiskAssessmentQuestions();
  }, []);

  const steps = useMemo(
    () => buildRiskAssessmentSteps(allAnswers.client_types),
    [allAnswers.client_types],
  );

  useEffect(() => {
    if (currentStep >= steps.length) {
      setCurrentStep(Math.max(steps.length - 1, 0));
    }
  }, [currentStep, steps.length]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              style={{ width: `${Math.random() * 100}%` }}
              className=" h-10 bg-gray-200 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <RiskAssessmentSteps questions={riskAssessmentQuestions} form={form} />
      )}
    </div>
  );
};

export default RiskAssessmentTab;
