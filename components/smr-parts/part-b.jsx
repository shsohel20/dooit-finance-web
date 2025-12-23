'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import SelectCaseList from '../ui/SelectCaseList';
import { autoPopulatedSMRData } from '@/app/dashboard/client/report-compliance/smr-filing/smr/actions';

export function PartB({ data, updateData }) {
  const [caseNumber, setCaseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCaseNumberChange = async (value) => {
    setCaseNumber(value.value);
    setIsLoading(true);
    updateData({ caseNumber: value });
    try {
      const response = await autoPopulatedSMRData(value.value);
      console.log('autoPopulatedSMRData', response);
      updateData({
        groundsForSuspicion: response.narrative,
        personOrganisation: {
          ...data.personOrganisation,
          name: response.name,
          emails: [response.email_address],
          phoneNumbers: [...response.phone_numbers],
          dateOfBirth: response.dob,
          citizenship: response.country_of_citizenship,
        },
        transactions: [
          {
            date: response.transaction_details?.date_of_transaction ?? '',
            type: response.transaction_details?.transaction_type ?? '',
            referenceNumber:
              response.transaction_details?.transaction_reference_number ?? '',
            totalAmount: {
              currencyCode: response.transaction_details?.currency ?? '',
              amount: response.transaction_details?.total_amount ?? 0,
            },
            cashAmount: {
              currencyCode: response.transaction_details?.currency ?? '',
              amount: response.transaction_details?.total_cash_involved ?? 0,
            },
            completed: false,
            foreignCurrencies: [],
            digitalCurrencies: [],
            sender: {
              name: response.parties?.sender?.name ?? '',
              institutions: [response.parties?.sender?.institution ?? ''],
            },
            payee: {
              name: response.parties?.payee ?? '',
              institutions: [],
            },
            beneficiary: {
              name: response.parties?.beneficiary?.name ?? '',
              institutions: [response.parties?.beneficiary?.institution ?? ''],
            },
          },
        ],
      });
    } catch (error) {
      console.error('Failed to get data', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <SelectCaseList
          label="Case Number"
          onChange={handleCaseNumberChange}
          value={caseNumber}
        />
      </div>
      <div className="flex items-start gap-2">
        <Label htmlFor="grounds" className="text-base font-bold ">
          3. Provide details of the nature and circumstances surrounding the
          matter
        </Label>
        <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
      <p className="text-sm text-muted-foreground italic">
        Note: Do not provide account or transaction details as these will be
        required in Parts C - F.
      </p>
      <Textarea
        id="grounds"
        value={data?.groundsForSuspicion || ''}
        onChange={(e) => {
          // setGrounds(e.target.value);
          updateData({ groundsForSuspicion: e.target.value });
        }}
        isLoading={isLoading}
        placeholder="Describe the nature and circumstances of the suspicious matter..."
        className="min-h-[300px] border"
      />
    </div>
  );
}
