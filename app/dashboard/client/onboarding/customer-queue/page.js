import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import CustomerQueueList from '@/views/onboarding/customer-queue/list'

export default function Page() {
  const cases = [
    {
      id: 1,
      caseId: '#CA-1234567890',
      name: 'John Doe',
      email: 'john.doe@example.com',
      country: 'United States',
      kycStatus: 'Pending',
      riskLevel: 'Low',
      startedOn: '12/08/2025',
      status: 'Pending',
    },
    {
      id: 2,
      caseId: '#CA-1234567891',
      name: 'Emma Smith',
      email: 'emma.smith@example.com',
      country: 'United Kingdom',
      kycStatus: 'Approved',
      riskLevel: 'Medium',
      startedOn: '10/07/2025',
      status: 'Approved',
    },
    {
      id: 3,
      caseId: '#CA-1234567892',
      name: 'Liam Johnson',
      email: 'liam.johnson@example.com',
      country: 'Canada',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '15/06/2025',
      status: 'Closed',
    },
    {
      id: 4,
      caseId: '#CA-1234567893',
      name: 'Olivia Brown',
      email: 'olivia.brown@example.com',
      country: 'Australia',
      kycStatus: 'Pending',
      riskLevel: 'Low',
      startedOn: '20/07/2025',
      status: 'Pending',
    },
    {
      id: 5,
      caseId: '#CA-1234567894',
      name: 'Noah Davis',
      email: 'noah.davis@example.com',
      country: 'Germany',
      kycStatus: 'In Review',
      riskLevel: 'Medium',
      startedOn: '05/09/2025',
      status: 'In Review',
    },
    {
      id: 6,
      caseId: '#CA-1234567895',
      name: 'Ava Wilson',
      email: 'ava.wilson@example.com',
      country: 'France',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '02/04/2025',
      status: 'Approved',
    },
    {
      id: 7,
      caseId: '#CA-1234567896',
      name: 'Ethan Martinez',
      email: 'ethan.martinez@example.com',
      country: 'Spain',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '18/05/2025',
      status: 'Closed',
    },
    {
      id: 8,
      caseId: '#CA-1234567897',
      name: 'Sophia Anderson',
      email: 'sophia.anderson@example.com',
      country: 'Italy',
      kycStatus: 'Pending',
      riskLevel: 'Medium',
      startedOn: '25/08/2025',
      status: 'Pending',
    },
    {
      id: 9,
      caseId: '#CA-1234567898',
      name: 'William Thomas',
      email: 'william.thomas@example.com',
      country: 'Netherlands',
      kycStatus: 'In Review',
      riskLevel: 'Low',
      startedOn: '28/03/2025',
      status: 'In Review',
    },
    {
      id: 10,
      caseId: '#CA-1234567899',
      name: 'Isabella Taylor',
      email: 'isabella.taylor@example.com',
      country: 'Singapore',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '01/02/2025',
      status: 'Approved',
    },
    {
      id: 11,
      caseId: '#CA-1234567800',
      name: 'James Lee',
      email: 'james.lee@example.com',
      country: 'South Korea',
      kycStatus: 'Pending',
      riskLevel: 'Medium',
      startedOn: '10/03/2025',
      status: 'Pending',
    },
    {
      id: 12,
      caseId: '#CA-1234567801',
      name: 'Mia Harris',
      email: 'mia.harris@example.com',
      country: 'Japan',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '15/09/2025',
      status: 'Approved',
    },
    {
      id: 13,
      caseId: '#CA-1234567802',
      name: 'Benjamin Clark',
      email: 'benjamin.clark@example.com',
      country: 'Sweden',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '09/07/2025',
      status: 'Closed',
    },
    {
      id: 14,
      caseId: '#CA-1234567803',
      name: 'Charlotte Lewis',
      email: 'charlotte.lewis@example.com',
      country: 'Norway',
      kycStatus: 'Pending',
      riskLevel: 'Low',
      startedOn: '12/08/2025',
      status: 'Pending',
    },
    {
      id: 15,
      caseId: '#CA-1234567804',
      name: 'Lucas Walker',
      email: 'lucas.walker@example.com',
      country: 'Brazil',
      kycStatus: 'In Review',
      riskLevel: 'Medium',
      startedOn: '22/06/2025',
      status: 'In Review',
    },
    {
      id: 16,
      caseId: '#CA-1234567805',
      name: 'Amelia Hall',
      email: 'amelia.hall@example.com',
      country: 'India',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '30/07/2025',
      status: 'Approved',
    },
    {
      id: 17,
      caseId: '#CA-1234567806',
      name: 'Elijah Allen',
      email: 'elijah.allen@example.com',
      country: 'Bangladesh',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '08/05/2025',
      status: 'Closed',
    },
    {
      id: 18,
      caseId: '#CA-1234567807',
      name: 'Harper Young',
      email: 'harper.young@example.com',
      country: 'Mexico',
      kycStatus: 'Pending',
      riskLevel: 'Low',
      startedOn: '11/10/2025',
      status: 'Pending',
    },
    {
      id: 19,
      caseId: '#CA-1234567808',
      name: 'Alexander King',
      email: 'alexander.king@example.com',
      country: 'United Arab Emirates',
      kycStatus: 'In Review',
      riskLevel: 'Medium',
      startedOn: '03/08/2025',
      status: 'In Review',
    },
    {
      id: 20,
      caseId: '#CA-1234567809',
      name: 'Evelyn Wright',
      email: 'evelyn.wright@example.com',
      country: 'Switzerland',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '21/06/2025',
      status: 'Approved',
    },
    {
      id: 21,
      caseId: '#CA-1234567810',
      name: 'Henry Scott',
      email: 'henry.scott@example.com',
      country: 'Ireland',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '05/04/2025',
      status: 'Closed',
    },
    {
      id: 22,
      caseId: '#CA-1234567811',
      name: 'Ella Green',
      email: 'ella.green@example.com',
      country: 'Denmark',
      kycStatus: 'Pending',
      riskLevel: 'Low',
      startedOn: '14/08/2025',
      status: 'Pending',
    },
    {
      id: 23,
      caseId: '#CA-1234567812',
      name: 'Daniel Adams',
      email: 'daniel.adams@example.com',
      country: 'Belgium',
      kycStatus: 'In Review',
      riskLevel: 'Medium',
      startedOn: '07/05/2025',
      status: 'In Review',
    },
    {
      id: 24,
      caseId: '#CA-1234567813',
      name: 'Grace Nelson',
      email: 'grace.nelson@example.com',
      country: 'New Zealand',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '09/03/2025',
      status: 'Approved',
    },
    {
      id: 25,
      caseId: '#CA-1234567814',
      name: 'Matthew Carter',
      email: 'matthew.carter@example.com',
      country: 'South Africa',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '12/01/2025',
      status: 'Closed',
    },
    {
      id: 26,
      caseId: '#CA-1234567815',
      name: 'Scarlett Mitchell',
      email: 'scarlett.mitchell@example.com',
      country: 'Finland',
      kycStatus: 'Pending',
      riskLevel: 'Medium',
      startedOn: '04/07/2025',
      status: 'Pending',
    },
    {
      id: 27,
      caseId: '#CA-1234567816',
      name: 'Jack Perez',
      email: 'jack.perez@example.com',
      country: 'Portugal',
      kycStatus: 'In Review',
      riskLevel: 'Low',
      startedOn: '19/08/2025',
      status: 'In Review',
    },
    {
      id: 28,
      caseId: '#CA-1234567817',
      name: 'Luna Roberts',
      email: 'luna.roberts@example.com',
      country: 'Malaysia',
      kycStatus: 'Approved',
      riskLevel: 'Low',
      startedOn: '22/06/2025',
      status: 'Approved',
    },
    {
      id: 29,
      caseId: '#CA-1234567818',
      name: 'Owen Turner',
      email: 'owen.turner@example.com',
      country: 'Philippines',
      kycStatus: 'Rejected',
      riskLevel: 'High',
      startedOn: '16/09/2025',
      status: 'Closed',
    },
    {
      id: 30,
      caseId: '#CA-1234567819',
      name: 'Chloe Phillips',
      email: 'chloe.phillips@example.com',
      country: 'Indonesia',
      kycStatus: 'Pending',
      riskLevel: 'Low',
      startedOn: '25/08/2025',
      status: 'Pending',
    },
  ];

  const pendingCases = cases.filter(c => c.kycStatus === 'Pending')
  const rejectedCases = cases.filter(c => c.kycStatus === 'Rejected');
  const approvedCases = cases.filter(c => c.kycStatus === 'Approved');
  const readyForVerificationCases = cases.filter(c => c.kycStatus === 'In Review');
  return (
    <div>

      <Tabs defaultValue="pending-collection" >
        <TabsList>
          <TabsTrigger value="all-applications">
            All
            <Badge variant="secondary">100</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending-collection">
            Pending Collection
            <Badge variant="secondary">13</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected-applications">
            Rejected Applications
          </TabsTrigger>
          <TabsTrigger value="ready-for-verification">
            Ready for Verification
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-applications">
          <CustomerQueueList variant='all' data={cases} />
        </TabsContent>
        <TabsContent value="pending-collection">
          <CustomerQueueList variant='pending' data={pendingCases} />
        </TabsContent>
        <TabsContent value="rejected-applications">
          <CustomerQueueList variant='rejected' data={rejectedCases} />
        </TabsContent>
        <TabsContent value="ready-for-verification">
          <CustomerQueueList variant='ready-for-verification' data={readyForVerificationCases} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
