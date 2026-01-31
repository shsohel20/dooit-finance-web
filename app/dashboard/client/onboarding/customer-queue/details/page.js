"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DetailViewModal } from "@/views/onboarding/customer-queue/details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelationsTree } from "@/views/onboarding/customer-queue/details/RelationsTree";
import { getCustomerById } from "../actions";
import Documents from "@/views/onboarding/customer-queue/details/Document";

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
      </Tabs>
      {/* <DetailViewModal currentId={id} /> */}
    </div>
  );
}
