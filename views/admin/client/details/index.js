'use client';
import { getClientById } from "@/app/dashboard/admin/client/actions";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import LabelDetails from "@/components/LabelDetails";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEdit } from "@tabler/icons-react";
import { Fragment, useEffect, useState } from "react";



export default function ClientDetails({ id }) {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  console.log('client', client);

  useEffect(() => {
    setLoading(true);
    const fetchClient = async () => {
      const response = await getClientById(id);
      setClient(response.data);
      setLoading(false);
    };
    fetchClient();
  }, [id]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader>
          <PageTitle>Client Details</PageTitle>
          <PageDescription>View the client details here.</PageDescription>
        </PageHeader>
        <Button><IconEdit /> Edit</Button>
      </div>
      <div className=" mt-8 space-y-4">
        {/* Company Information */}
        <div className="p-8 border rounded-lg">
          <div className=" mb-12">
            <h4 className="font-medium text-base">Company Information</h4>
            <p className="text-muted-foreground">View the company information of the client here.</p>
          </div>
          <div className="grid grid-cols-6 gap-8 ">
            <div className="">
              <LabelDetails label="Name" value={client?.name} loading={loading} />
            </div>
            <div className="">
              <LabelDetails label="Email" value={client?.email} loading={loading} />
            </div>
            <div className="">
              <LabelDetails label="Phone" value={client?.phone} loading={loading} />
            </div>
            <div className="col-span-2">
              <LabelDetails label="Address" value={client?.fullAddress} loading={loading} />
            </div>

            <div className="">
              <LabelDetails label="Website" value={client?.website} loading={loading} />
            </div>
            <div className="">
              <LabelDetails label="Registration Number" value={client?.registrationNumber} loading={loading} />
            </div>
            <div className="">
              <LabelDetails label="Tax ID" value={client?.taxId} loading={loading} />
            </div>
            <div className="">
              <LabelDetails label="Status" value={client?.status} loading={loading} />
            </div>

          </div>
        </div>

        {/* contacts */}
        <div className="p-8 border rounded-lg">
          <div className=" mb-12">
            <h4 className="font-medium text-base">Contacts</h4>
            <p className="text-muted-foreground">View the contacts of the client here.</p>
          </div>
          <div className="grid grid-cols-6 gap-8 ">
            {client?.contacts?.map((contact) => (
              <Fragment key={contact?.id}>
                <LabelDetails label="Name" value={contact?.name} loading={loading} />
                <LabelDetails label="Email" value={contact?.email} loading={loading} />
                <LabelDetails label="Phone" value={contact?.phone} loading={loading} />
                <LabelDetails label="Designation" value={contact?.title} loading={loading} />
              </Fragment>
            ))}
          </div>
        </div>
        {/* legal representative */}
        <div className="p-8 border rounded-lg">
          <div className=" mb-12">
            <h4 className="font-medium text-base">Legal Representative</h4>
            <p className="text-muted-foreground">View the legal representative of the client here.</p>
          </div>
          <div className="grid grid-cols-6 gap-8 ">
            <LabelDetails label="Name" value={client?.legalRepresentative?.name} loading={loading} />
            <LabelDetails label="Email" value={client?.legalRepresentative?.email} loading={loading} />
            <LabelDetails label="Phone" value={client?.legalRepresentative?.phone} loading={loading} />
            <LabelDetails label="Designation" value={client?.legalRepresentative?.designation} loading={loading} />
          </div>
        </div>

        {/* settings */}
        <div className="p-8 border rounded-lg">
          <div className=" mb-12">
            <h4 className="font-medium text-base">Settings</h4>
            <p className="text-muted-foreground">View the settings of the client here.</p>
          </div>
          <div className="grid grid-cols-6 gap-8 ">
            <LabelDetails label="Billing Cycle" value={client?.settings?.billingCycle} loading={loading} />
            <LabelDetails label="Currency" value={client?.settings?.currency} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}