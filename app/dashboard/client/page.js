"use client";

import useGetUser from "@/hooks/useGetUser";
import ClientDashboardPage from "@/views/client-dashboard/dashboard";
import CryptoCurrencyDashboard from "@/views/crypto-currency/dashboard";
import PreciousMetalDashboard from "@/views/precious-metal/dashboard";
import RealEstateDashboard from "@/views/real-estate/dashboard";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { getAllEntityTypes } from "../actions";

export default function DashboardClientPage() {
  const { loggedInUser } = useGetUser();
  const [entityTypes, setEntityTypes] = useState([]);
  //entity types
  const financialEntity = entityTypes.find((entity) => entity.name === "Banks & ADIs");
  const realStateEntity = entityTypes.find((entity) => entity.name === "Real Estate");
  const preciousMetalEntity = entityTypes.find(
    (entity) => entity.name === "Precious Metal Dealers",
  );
  const cryptoEntity = entityTypes.find((entity) => entity.name === "VASP/DCEP");
  const clientType = loggedInUser?.client?.clientType;

  //is financial
  const isFinancial = financialEntity?.matchKeywords?.includes(clientType?.toLowerCase());
  //is real state
  const isRealState = realStateEntity?.matchKeywords.includes(clientType?.toLowerCase());
  //is precious metal
  const isPreciousMetal = preciousMetalEntity?.matchKeywords.includes(clientType?.toLowerCase());
  //is crypto
  const isCrypto = cryptoEntity?.matchKeywords.includes(clientType?.toLowerCase());

  useEffect(() => {
    const fetchEntityTypes = async () => {
      const response = await getAllEntityTypes();
      setEntityTypes(response.data);
    };
    fetchEntityTypes();
  }, []);
  return (
    <div>
      {isRealState && <RealEstateDashboard />}
      {isFinancial && <ClientDashboardPage />}
      {isPreciousMetal && <PreciousMetalDashboard />}
      {isCrypto && <CryptoCurrencyDashboard />}
    </div>
  );
}
