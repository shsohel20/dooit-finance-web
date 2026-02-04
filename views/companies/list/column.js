import { IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
export const companiesColumns = (handleView)=>{
    return [
        {
            id: 'actions',
            header: 'Actions',
            accessorKey: 'actions',
            cell: ({ row }) => {
                return <div className="text-xs">
                   
                    <Button variant="outline" size="icon" onClick={() => handleView(row.original._id)}>
                        <IconEye />
                    </Button>
                </div>
            }
        },
        {
            id: 'name',
            header: 'Name',
            accessorKey: 'generalInformation.legalName',
            cell: ({ row }) => {
                const generalData = row.original.general_information;
                return <div className=" ">
                    <p className="text-xs font-semibold">{generalData?.legal_name} ({generalData?.trading_names})</p>
                    <p className="text-xs text-muted-foreground text-wrap">
                      {generalData?.contact_email} ({generalData?.phone_number})
                        </p>
                   
                    </div>
            }
        },
        {
            id: 'nature-of-business',
            header: 'Nature of Business',
            accessorKey: 'nature_of_business',
            // size: 100,
            cell: ({ row }) => {
                return <div className="text-xs  max-w-[150px] text-wrap">
                    {row.original.general_information?.nature_of_business}
                </div>
            }
        },
        
        {
            id: 'local-agent',
            header: 'Local Agent',
            accessorKey: 'local_agent.name',
            cell: ({ row }) => {
                return <div  className="text-xs">
                    {row.original.general_information?.local_agent?.name}
                </div>
            }
        },
        {
            id: 'annual-income',
            header: 'Annual Income',
            accessorKey: 'annual_income',
            cell: ({ row }) => {
                return <div className="font-mono">
                    {row.original.general_information?.annual_income}
                </div>
            }
        },
        {
            id: 'address',
            header: 'Address',
            accessorKey: 'address',
            size: 400,
            cell: ({ row }) => {
                return <div className="text-xs text-muted-foreground text-wrap max-w-[300px]">
                    {row.original.general_information?.registered_address?.street}, {row.original.general_information?.registered_address?.suburb}, {row.original.general_information?.registered_address?.state}, {row.original.general_information?.registered_address?.postcode}, {row.original.general_information?.registered_address?.country}
                </div>
            }
        },
        {
            id: 'country-of-incorporation',
            header: 'Country',
            accessorKey: 'country_of_incorporation',
            cell: ({ row }) => {
                return <div className="text-xs">
                    {row.original.general_information?.country_of_incorporation}
                </div>
            }
        }
    ]
}