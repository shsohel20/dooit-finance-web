"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAlertStore from "@/app/store/alerts";
import { getEcddByCaseNumber } from "@/app/dashboard/client/report-compliance/ecdd/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressDetails } from "./ecdd/AddressDetails";
import { CustomerHeader } from "./ecdd/CustomerHeader";
import { PersonalDetails } from "./ecdd/PersonalDetails";
import { EmploymentDetails } from "./ecdd/Employeedetails";
import { FundsWealth } from "./ecdd/FundsWealth";
import { Declaration } from "./ecdd/declaration";
import { ClientRelations } from "./ecdd/ClientRelations";
import { Button } from "@/components/ui/button";

const Ecdd = () => {
  const [ecddData, setEcddData] = useState(null);
  const params = useParams();
  const query = useSearchParams();
  const caseNumber = query.get("caseNumber");
  const { details } = useAlertStore();
  const router = useRouter();
  console.log("details", details);
  const fetchEcddData = async () => {
    try {
      const response = await getEcddByCaseNumber("CA_1764067413258");
      console.log("ecdd response", response.data);
      setEcddData(response.data);
    } catch (error) {
      console.error("Failed to get data", error);
    }
  };
  useEffect(() => {
    fetchEcddData();
  }, [details?.uid]);

  const handleNewEcdd = () => {
    router.push(`/dashboard/client/report-compliance/ecdd/form?caseNumber=${caseNumber}`);
  };
  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="flex justify-end mb-4"><Button onClick={handleNewEcdd}>New ECDD</Button></div>
        <div className="">
          <CustomerHeader customer={ecddData} />

          <div className="grid gap-6 mt-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <PersonalDetails customer={ecddData} />
              <EmploymentDetails customer={ecddData} />
              <div className="grid gap-6 md:grid-cols-2">
                <AddressDetails
                  title="Residential Address"
                  address={
                    ecddData?.customer?.personalKyc?.personal_form
                      ?.residential_address
                  }
                />
                <AddressDetails
                  title="Mailing Address"
                  address={
                    ecddData?.customer?.personalKyc?.personal_form
                      ?.mailing_address
                  }
                />
              </div>
              <FundsWealth customer={ecddData} />
            </div>

            <div className="space-y-6">
              <Declaration customer={ecddData} />
              <ClientRelations relations={ecddData?.customer?.relations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecdd;
