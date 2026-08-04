'use client';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import SelectCaseList from '../ui/SelectCaseList';
import SelectCase from '../ui/SelectCase';
import { autoPopulatedSMRData } from '@/app/dashboard/client/report-compliance/smr-filing/smr/actions';
// Shared with the detail view so a label edited here cannot drift out of sync
// and silently render as unticked there.
import {
  DESIGNATED_SERVICES,
  SUSPICION_REASONS,
  SERVICE_STATUSES,
} from './options';

export function PartA({ data, updateData }) {
  const [selectedServices, setSelectedServices] = useState(
    data.designatedServices || []
  );
  const [isLoading, setIsLoading] = useState(false);
  console.log('selectedServices', selectedServices);
  const [serviceStatus, setServiceStatus] = useState(
    data.serviceStatus || 'provided'
  );
  const [selectedReasons, setSelectedReasons] = useState(
    data.suspicionReasons || []
  );
  const [otherReasons, setOtherReasons] = useState(data.otherReasons || ['']);

  useEffect(() => {
    setSelectedServices(data.designatedServices || []);
    setServiceStatus(data.serviceStatus || 'provided');
    setSelectedReasons(data.suspicionReasons || []);
    setOtherReasons(data.otherReasons || ['']);
  }, [data]);

  const handleServiceToggle = (service) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(updated);
    updateData({ designatedServices: updated });
  };

  const handleReasonToggle = (reason) => {
    const updated = selectedReasons.includes(reason)
      ? selectedReasons.filter((r) => r !== reason)
      : [...selectedReasons, reason];
    setSelectedReasons(updated);
    updateData({ suspicionReasons: updated });
  };

  const addOtherReason = () => {
    setOtherReasons([...otherReasons, '']);
  };

  const updateOtherReason = (index, value) => {
    const updated = [...otherReasons];
    updated[index] = value;
    setOtherReasons(updated);
    updateData({ otherReasons: updated.filter((r) => r.trim() !== '') });
  };
  const handleCaseNumberChange = async (value) => {
    setIsLoading(true);
    console.log('value', value);
    updateData({ caseNumber: value });
    try {
      const response = await autoPopulatedSMRData(value.value);

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
      console.log('Failed to get data', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Question 1 */}
      <div className="space-y-4">
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <SelectCaseList
            label="Alert / Case Number"
            onChange={handleCaseNumberChange}
            value={data?.caseNumber}
          />
          <div>
            <SelectCase
              label="Case (investigation hub)"
              value={data?.caseId || null}
              onChange={(value) => updateData({ caseId: value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Optional — leave blank to inherit the Case from the selected alert
              once it has been escalated.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Label className="text-base font-bold ">
            1. Please specify the designated service(s) to which the suspicious
            matter relates
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-secondary/50 rounded-md border border-muted">
          {DESIGNATED_SERVICES.map((service) => (
            <div key={service} className="flex items-start gap-2">
              <Checkbox
                id={service}
                checked={selectedServices.includes(service)}
                onCheckedChange={() => handleServiceToggle(service)}
              />
              <label
                htmlFor={service}
                className="text-sm leading-tight cursor-pointer"
              >
                {service}
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold">
              Was the designated service(s):
            </Label>
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <RadioGroup
            value={serviceStatus}
            onValueChange={(value) => {
              setServiceStatus(value);
              updateData({ serviceStatus: value });
            }}
            className="flex gap-6"
          >
            {SERVICE_STATUSES.map((status) => (
              <div key={status.value} className="flex items-center gap-2">
                <RadioGroupItem value={status.value} id={status.value} />
                <Label htmlFor={status.value} className="cursor-pointer">
                  {status.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Question 2 */}
      <div className="space-y-4 pt-6 border-t-2 ">
        <div className="flex items-start gap-2">
          <Label className="text-base font-bold ">
            2. Please specify the reason(s) for the suspicion, which may include
          </Label>
          <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-secondary/50 rounded-md border border-muted">
          {SUSPICION_REASONS.map((reason) => (
            <div key={reason} className="flex items-start gap-2">
              <Checkbox
                id={reason}
                checked={selectedReasons.includes(reason)}
                onCheckedChange={() => handleReasonToggle(reason)}
              />
              <label
                htmlFor={reason}
                className="text-sm leading-tight cursor-pointer"
              >
                {reason}
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Other, please specify:
          </Label>
          {otherReasons.map((reason, index) => (
            <Input
              key={index}
              value={reason}
              onChange={(e) => updateOtherReason(index, e.target.value)}
              placeholder="Specify other reason for suspicion"
              className="border-2 "
            />
          ))}
          <Button
            type="button"
            onClick={addOtherReason}
            variant="outline"
            size="sm"
            className=" bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another reason for suspicion
          </Button>
        </div>
      </div>
    </div>
  );
}
