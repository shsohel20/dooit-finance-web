"use client";

import useGetUser from "@/hooks/useGetUser";
import ClientDashboardPage from "@/views/client-dashboard/dashboard";
import CryptoCurrencyDashboard from "@/views/crypto-currency/dashboard";
import PreciousMetalDashboard from "@/views/precious-metal/dashboard";
import RealEstateDashboard from "@/views/real-estate/dashboard";
import React, { useEffect, useState } from "react";
import { getAllEntityTypes } from "../actions";

export default function DashboardClientPage() {
  const { loggedInUser } = useGetUser();
  const [entityTypes, setEntityTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchEntityTypes = async () => {
      try {
        const response = await getAllEntityTypes();
        if (active) setEntityTypes(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load entity types:", err);
        if (active) setEntityTypes([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchEntityTypes();
    return () => {
      active = false;
    };
  }, []);

  const clientType = loggedInUser?.client?.clientType;

  // A client maps to an entity-type dashboard when its clientType matches that
  // entity by name, id, or one of the entity's matchKeywords (case-insensitive).
  const matchesEntity = (name) => {
    const entity = entityTypes.find((e) => e.name === name);
    if (!entity || !clientType) return false;
    const ct = String(clientType).toLowerCase();
    return (
      entity.name?.toLowerCase() === ct ||
      String(entity._id) === String(clientType) ||
      entity.matchKeywords?.includes(ct) ||
      false
    );
  };

  const isFinancial = matchesEntity("Banks & ADIs");
  const isRealState = matchesEntity("Real Estate");
  const isPreciousMetal = matchesEntity("Precious Metal Dealers");
  const isCrypto = matchesEntity("VASP/DCEP");
  const hasMatchedDashboard = isFinancial || isRealState || isPreciousMetal || isCrypto;

 

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {isRealState && <RealEstateDashboard />}
      {isFinancial && <ClientDashboardPage />}
      {isPreciousMetal && <PreciousMetalDashboard />}
      {isCrypto && <CryptoCurrencyDashboard />}
      {/* Fallback so the page is never blank when no specific entity type matches */}
      {!hasMatchedDashboard && <ClientDashboardPage />}
    </div>
  );
}
