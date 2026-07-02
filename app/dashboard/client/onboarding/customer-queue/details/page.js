"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DetailViewModal } from "@/views/onboarding/customer-queue/details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelationsTree } from "@/views/onboarding/customer-queue/details/RelationsTree";
import { getCustomerById } from "../actions";
import Documents from "@/views/onboarding/customer-queue/details/Document";
import { Osiint } from "@/views/onboarding/customer-queue/details/Osiint";
import { Transactions } from "@/views/onboarding/customer-queue/details/Transactions";
import useGetUser from "@/hooks/useGetUser";
import RelationGraph from "@/views/onboarding/customer-queue/details/relation-graph";
import KycExportButton from "@/components/KycExportButton";

export default function CustomerQueueDetails() {
  const id = useSearchParams().get("id");
  const [details, setDetails] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchDetails = async () => {
    setFetching(true);
    try {
      const response = await getCustomerById(id);
      console.log("response", response);
      if (response.success) {
        setDetails({ ...response.data, journeys: response.journeys });
      }
    } catch (error) {
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  return (
    <div>
      <Tabs defaultValue="details">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="relations">Relations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="osint">OSINT</TabsTrigger>
          </TabsList>
          <KycExportButton customerId={id} />
        </div>
        <TabsContent value="details">
          <DetailViewModal details={details} fetching={fetching} />
        </TabsContent>
        <TabsContent value="relations">
          <RelationsTree relations={details?.relations || []} details={details} />
          {/* <RelationGraph details={details} /> */}
          {/* <RelatedParty /> */}
        </TabsContent>
        <TabsContent value="documents">
          <Documents documents={details} />
        </TabsContent>
        <TabsContent value="osint">
          <Osiint data={details?.osintReport} />
        </TabsContent>
        <TabsContent value="transactions">
          <Transactions customerId={id} />
        </TabsContent>
      </Tabs>
      {/* <DetailViewModal currentId={id} /> */}
    </div>
  );
}
