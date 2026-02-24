"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DetailViewModal } from "@/views/onboarding/customer-queue/details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelationsTree } from "@/views/onboarding/customer-queue/details/RelationsTree";
import { getCustomerById } from "../actions";
import Documents from "@/views/onboarding/customer-queue/details/Document";
import OSINTPage from "@/views/onboarding/customer-queue/osint";

export default function CustomerQueueDetails() {
  const id = useSearchParams().get("id");
  const [details, setDetails] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchDetails = async () => {
    setFetching(true);
    try {
      const response = await getCustomerById(id);
      if (response.success) {
        setDetails(response.data);
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
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="osint">OSINT</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailViewModal details={details} fetching={fetching} />
        </TabsContent>
        <TabsContent value="relations">
          <RelationsTree relations={details?.relations || []} />
        </TabsContent>
        <TabsContent value="documents">
          <Documents documents={details} />
        </TabsContent>
        <TabsContent value="osint">
          <OSINTPage />
        </TabsContent>
        <TabsContent value="transactions">
          <div className="min-h-56 grid place-items-center border rounded-md">
            No transactions yet
          </div>
        </TabsContent>
      </Tabs>
      {/* <DetailViewModal currentId={id} /> */}
    </div>
  );
}
