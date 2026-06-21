"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import PrimarySelection from "./primary";
import ClientTypesStep, { CLIENT_TYPES } from "./primary/client-types";
import DeliveryChannelsStep from "./primary/delivery-channels";
import DesignatedServicesStep from "./primary/designated-services";
import LawyerRisk from "./primary/LawyerRisk";
import { getRiskAssessmentQuestions, getRiskRegisters } from "../../actions";
import { useForm } from "react-hook-form";
import RiskAssessmentSteps from "./steps";
import { useLoggedInUser } from "@/app/store/useLoggedInUser";
import RiskRegisters from "./RiskRegisters";

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

const RiskAssessmentTab = ({ setCurrentStep }) => {
  const [riskAssessmentQuestions, setRiskAssessmentQuestions] = useState([]);
  const [riskRegisters, setRiskRegisters] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loggedInUser } = useLoggedInUser();
  const form = useForm();
  console.log("loggedInUser", loggedInUser);

  useEffect(() => {
    const fetchRiskAssessmentQuestions = async () => {
      setLoading(true);
      try {
        const response = await getRiskAssessmentQuestions();
        setRiskAssessmentQuestions(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchRiskAssessmentQuestions();
  }, []);

  useEffect(() => {
    const fetchRiskRegisters = async () => {
      const response = await getRiskRegisters(loggedInUser?.name);
      console.log("risk registers", JSON.stringify(response.data, null, 2));
      setRiskRegisters(response.data);
    };
    fetchRiskRegisters();
  }, []);

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
      ) : riskRegisters ? (
        <RiskRegisters riskRegisters={riskRegisters} />
      ) : (
        <div className="px-6 py-10 rounded bg-gray-50 mt-4">
          <RiskAssessmentSteps
            questions={riskAssessmentQuestions}
            form={form}
            setTrackingStep={setCurrentStep}
          />
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentTab;
