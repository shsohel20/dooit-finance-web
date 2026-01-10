'use client';

import {
  createEcdd,
  autoPopulatedEcddData,
  updateEcdd,
} from '@/app/dashboard/client/report-compliance/ecdd/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Save,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import UILoader from './UILoader';
import { getCaseList } from '@/app/dashboard/client/monitoring-and-cases/case-list/actions';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getEcddById } from '@/app/dashboard/client/report-compliance/ecdd/actions';
import SelectCaseList from './ui/SelectCaseList';

const formSchema = z.object({
  caseNumber: z.object({
    label: z.string(),
    value: z.string(),
  }),
  analystName: z.string(),
  fullName: z.string(),
  accountPurpose: z.string(),
  onboardingDate: z.string(),
  expectedVolume: z.coerce.number(),
  beneficialOwner: z.string(),
  withdrawalDetails: z.string(),
  accountCreationDate: z.string(),
  totalDepositsAUD: z.string(),
  totalWithdrawalsUSDT: z.string(),
  totalWithdrawalsETH: z.string(),
  totalWithdrawalsBTC: z.string(),
  depositDetails: z.string(),
  ipLocations: z.coerce.number(),
  registeredAddress: z.string(),
  annualIncome: z.coerce.number(),
  additionalInfo: z.string(),
  behavioralAnalysis: z.string(),
  directors: z.string(),
  isPEP: z.string(),
  isSanctioned: z.string(),
  relatedParty: z.string(),
  totalDepositsAUD: z.coerce.number(),
  totalWithdrawalsUSDT: z.coerce.number(),
  totalWithdrawalsETH: z.coerce.number(),
  totalWithdrawalsBTC: z.coerce.number(),
  analysisEndDate: z.string(),
  accountCreationDate: z.string(),
  transactionAnalysis: z.string(),
  abn: z.string(),
  profileSummary: z.string(),
  recommendation: z.string().optional(),
  transaction: z.string().optional(),
  generatedBy: z.string().optional(),
  analyst: z.string().optional(),
  customer: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

export function ECDDForm({ caseNumber, id }) {
  const [formData, setFormData] = useState({
    isPEP: 'No',
    isSanctioned: 'No',
    relatedParty: 'N/A',
    abn: '',

    position: 'Compliance Officer',
    date: new Date().toISOString().split('T')[0],
    analystName: '',
    analysisEndDate: '',
    fullName: '',
    accountPurpose: '',
    onboardingDate: '',
    expectedVolume: 0,
    beneficialOwner: '',
    withdrawalDetails: '',
    accountCreationDate: '',
    totalDepositsAUD: 0,
    totalWithdrawalsUSDT: 0,
    totalWithdrawalsETH: 0,
    totalWithdrawalsBTC: 0,
    depositDetails: '',
    ipLocations: '',
    registeredAddress: '',
    annualIncome: 0,
    additionalInfo: '',
    behavioralAnalysis: '',
    directors: '',
    isPEP: 'No',
    isSanctioned: 'No',
    relatedParty: 'N/A',
    transaction: '',
    generatedBy: '',
    analyst: '',
    customer: '',
    profileSummary: '',
    transactionAnalysis: '',
    recommendation: '',
    ipLocations: '',
    registeredAddress: '',
    behavioralAnalysis: '',
    recommendation: '',
    additionalInfo: '',
    behavioralAnalysis: '',
    directors: '',
    isPEP: 'No',
    isSanctioned: 'No',
    relatedParty: 'N/A',
    transaction: '',
    generatedBy: '',

    customer: '',
    profileSummary: '',
    transactionAnalysis: '',
    recommendation: '',
    ipLocations: '',
    registeredAddress: '',
    behavioralAnalysis: '',
    recommendation: '',
    additionalInfo: '',
    behavioralAnalysis: '',
    directors: '',
    isPEP: 'No',
    isSanctioned: 'No',
    relatedParty: 'N/A',
  });

  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [caseNumbers, setCaseNumbers] = useState([]);
  const [fetchingCaseNumbers, setFetchingCaseNumbers] = useState(false);

  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (id) {
      getDataById();
    } else if (caseNumber) {
      getDataFromAIAnalysis();
    }
  }, [id, caseNumber]);

  const getDataFromAIAnalysis = async () => {
    setFetching(true);
    try {
      const response = await autoPopulatedEcddData(caseNumber);
      const formattedData = getFormattedData(response);
      reset(formattedData);
    } catch (error) {
      setValue('caseNumber', caseNumber);
      console.log('Failed to get data', error);
      // toast.error("Failed to get data");
    } finally {
      setFetching(false);
    }
  };

  const getDataById = async () => {
    setFetching(true);
    try {
      const response = await getEcddById(id);
      const {
        caseNumber,
        transaction,
        analyst,
        customer,
        customerName,
        ...data
      } = response?.data;
      const formattedData = {
        ...data,
        caseNumber: {
          label: caseNumber,
          value: caseNumber,
        },
        transaction: transaction?._id,
        analyst: analyst?._id,
        customer: customer?._id,
        onboardingDate: customer?.createdAt?.split('T')[0],
        position: 'Compliance Officer',
        accountCreationDate: data?.accountCreationDate?.split('T')[0] ?? '',
        analysisEndDate: data?.analysisEndDate?.split('T')[0] ?? '',
        date: data?.date ? data?.date?.split('T')[0] : '',
        generatedBy: data?.generatedBy?._id,
      };
      reset(formattedData);
    } catch (error) {
      console.error('Failed to get data', error);
      // toast.error("Failed to get data");
    } finally {
      setFetching(false);
    }
  };

  const getFormattedData = (data) => {
    const formattedData = {
      withdrawalDetails: data.withdrawal_details || '',
      depositDetails: data.deposit_details || '',
      profileSummary: data.recommendation || '',
      additionalInfo: data.additional_information || '',
      behavioralAnalysis: data.behavioral_analysis || '',
      analystName: data.analyst_name || '',
      position: 'Compliance Officer',
      date: data.analysis_date || new Date().toISOString().split('T')[0],
      caseNumber: caseNumber,
      fullName: data.name,
      onboardingDate: data.onboarding_date || '',
      expectedVolume: data.Expected_Trading_Volume || '',
      accountCreationDate: data.account_creation_date,
      totalDepositsAUD: data.total_deposits_AUD,
      totalWithdrawalsBTC: data.total_withdrawals_BTC,
      totalWithdrawalsETH: data.total_withdrawals_ETH,
      totalWithdrawalsUSDT: data.total_withdrawals_USDT,
      ipLocations: data.ip_locations || '',
      registeredAddress: data.registered_address || '',
      recommendation: data.recommendation || '',
      transactionAnalysis: data.transaction_analysis || '',
      directors: data.director_name || '',
      isPEP: data.pep_flag ? 'Yes' : 'No',
      isSanctioned: data.sanction_flag ? 'Yes' : 'No',
      userId: data.user_id,
      accountPurpose: data.account_purpose,
      annualIncome: data.annual_income,
      beneficialOwner: data.beneficial_owner || '',
      analysisEndDate: data.analysis_end_date,
      abn: data.abn || '',
      relatedParty: data.related_party || 'N/A',
      caseNumber: {
        label: caseNumber,
        value: caseNumber,
      },
      customer: data?.user_id,
    };
    return formattedData;
  };

  const handleSave = async (data) => {
    setLastSaved(new Date());
    setLoading(true);
    // const {} = formData;
    const submittedData = {
      ...data,
      caseNumber: data?.caseNumber?.value,
      ...(id ? { id: id } : {}),
    };

    const action = id ? updateEcdd : createEcdd;
    const response = await action(submittedData);
    if (response.success) {
      localStorage.setItem('newId', response.data._id);
      toast.success(
        id ? 'Case updated successfully' : 'Case created successfully'
      );
      router.push(`/dashboard/client/report-compliance/ecdd`);
    } else {
      console.log('submittedData', JSON.stringify(submittedData, null, 2));
      toast.error(response?.error || 'Failed to create case');
    }
    console.log('[v0] ECDD response', response);
    setLoading(false);
  };

  const fetchCaseNumbers = async () => {
    setFetchingCaseNumbers(true);
    try {
      const response = await getCaseList();
      const options = response.data.map((item) => ({
        ...item,
        label: item.uid,
        value: item.uid,
      }));

      setCaseNumbers(options);
    } catch (error) {
      console.error('Failed to get case numbers', error);
    } finally {
      setFetchingCaseNumbers(false);
    }
  };

  const handleCaseNumberChange = (value) => {
    const kycData = value?.customer?.personalKyc;

    setValue('caseNumber', value, { shouldValidate: true });
    if (value?.new) {
      setValue(
        'caseNumber',
        {
          label: value.label,
          value: value.value,
        },
        { shouldValidate: true }
      );
    } else {
      setValue('analystName', value?.analyst?.name, {
        shouldValidate: true,
      });
      setValue(
        'fullName',
        `${kycData?.personal_form?.customer_details?.given_name} ${kycData?.personal_form?.customer_details?.surname}`,
        { shouldValidate: true }
      );
      setValue('accountPurpose', kycData?.funds_wealth?.account_purpose, {
        shouldValidate: true,
      });
      setValue('onboardingDate', value?.customer?.createdAt?.split('T')[0], {
        shouldValidate: true,
      });
      setValue(
        'expectedVolume',
        kycData?.funds_wealth?.estimated_trading_volume,
        {
          shouldValidate: true,
        }
      );
      setValue('beneficialOwner', value?.transaction?.beneficiary?.name, {
        shouldValidate: true,
      });
      setValue('transaction', value?.transaction?._id, {
        shouldValidate: true,
      });
      setValue('generatedBy', value?.analyst?._id, {
        shouldValidate: true,
      });
      setValue('analyst', value?.analyst?._id, { shouldValidate: true });
      setValue('customer', value?.customer?._id, {
        shouldValidate: true,
      });
      setValue('isPEP', value?.customer?.isPep ? 'Yes' : 'No', {
        shouldValidate: true,
      });
      setValue('isSanctioned', value?.customer?.sanction ? 'Yes' : 'No', {
        shouldValidate: true,
      });
      setValue(
        'registeredAddress',
        kycData?.personal_form?.residential_address?.address,
        {
          shouldValidate: true,
        }
      );
    }
  };

  return (
    <UILoader loading={fetching} type="page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold  text-zinc-700 mb-2">
            Enhanced Customer Due Diligence
          </h1>
          <p className="text-muted-foreground">
            Upload data or manually complete the ECDD report
          </p>
          {lastSaved && (
            <p className="text-sm text-muted-foreground mt-2">
              Last saved: {lastSaved.toLocaleString()}
            </p>
          )}
        </div>
        {/* Section 1: Analysis and Review */}
        <Card className="border   p-6 mb-6">
          <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
            1. Analysis and Review
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="analystName"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="analystName">Analyst Name</Label>
                    <Input
                      id="analystName"
                      {...field}
                      placeholder="Enter analyst name"
                      error={errors.analystName?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      {...field}
                      placeholder="Enter position"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      {...field}
                      placeholder="Enter date"
                      type="date"
                    />
                  </div>
                )}
              />

              <div>
                <Controller
                  control={control}
                  name="caseNumber"
                  render={({ field }) => (
                    <SelectCaseList
                      label="Case Number"
                      options={caseNumbers}
                      value={field.value || null}
                      onChange={(value) => handleCaseNumberChange(value)}
                      onFocus={fetchCaseNumbers}
                      isLoading={fetchingCaseNumbers}
                      error={errors.caseNumber?.message}
                      // isDisabled={fetchingCaseNumbers}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Customer Profile */}
        <Card className="border   p-6 mb-6">
          <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
            2. Customer Profile
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...field}
                      placeholder="Enter full name"
                      error={errors.fullName?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="abn"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="abn">ABN</Label>
                    <Input
                      id="abn"
                      {...field}
                      placeholder="Enter ABN"
                      error={errors.abn?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="onboardingDate"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="onboardingDate">Onboarding Date</Label>
                    <Input
                      id="onboardingDate"
                      type="date"
                      {...field}
                      placeholder="Enter onboarding date"
                      error={errors.onboardingDate?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="accountPurpose"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="accountPurpose">Account Purpose</Label>
                    <Input
                      id="accountPurpose"
                      {...field}
                      placeholder="Enter account purpose"
                      error={errors.accountPurpose?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="expectedVolume"
                type="number"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="expectedVolume">
                      Expected Trading Volume (AUD)
                    </Label>
                    <Input
                      id="expectedVolume"
                      {...field}
                      type="number"
                      placeholder="Enter expected trading volume"
                      error={errors.expectedVolume?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="annualIncome"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="annualIncome">
                      Annual Income (Million AUD)
                    </Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      {...field}
                      placeholder="Enter annual income"
                      error={errors.annualIncome?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="beneficialOwner"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="beneficialOwner">Beneficial Owner</Label>
                    <Input
                      id="beneficialOwner"
                      {...field}
                      placeholder="Enter beneficial owner"
                      error={errors.beneficialOwner?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="directors"
                render={({ field }) => (
                  <div className="md:col-span-2">
                    <Label htmlFor="directors">Directors</Label>
                    <Input
                      id="directors"
                      {...field}
                      placeholder="Enter directors"
                      error={errors.directors?.message}
                    />
                  </div>
                )}
              />
            </div>
            <Controller
              control={control}
              name="profileSummary"
              render={({ field }) => (
                <div>
                  <Label htmlFor="profileSummary">Profile Summary</Label>
                  <Textarea
                    id="profileSummary"
                    {...field}
                    placeholder="Enter profile summary"
                    error={errors.profileSummary?.message}
                  />
                </div>
              )}
            />
          </div>
        </Card>

        {/* Section 3-5: PEP, Sanctioned, Related Party */}
        <Card className="border   p-6 mb-6">
          <div className="space-y-6">
            <Controller
              control={control}
              name="isPEP"
              render={({ field }) => (
                <div>
                  <Label htmlFor="isPEP">Customer is PEP (Y/N)</Label>
                  <Select
                    value={field.value || 'No'}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger id="isPEP">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              control={control}
              name="isSanctioned"
              render={({ field }) => (
                <div>
                  <Label htmlFor="isSanctioned">
                    Sanctioned Customer (Y/N)
                  </Label>
                  <Select
                    value={field.value || 'No'}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger id="isSanctioned">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              control={control}
              name="relatedParty"
              render={({ field }) => (
                <div>
                  <Label htmlFor="relatedParty">Related Party</Label>
                  <Input
                    id="relatedParty"
                    {...field}
                    placeholder="Enter related party"
                    error={errors.relatedParty?.message}
                  />
                </div>
              )}
            />
          </div>
        </Card>

        {/* Section 6: Transaction Analysis */}
        <Card className="border   p-6 mb-6">
          <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
            6. Transaction Analysis
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="accountCreationDate"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="accountCreationDate">
                      Account Creation Date
                    </Label>
                    <Input
                      id="accountCreationDate"
                      type="date"
                      {...field}
                      placeholder="Enter account creation date"
                      error={errors.accountCreationDate?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="analysisEndDate"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="analysisEndDate">Analysis End Date</Label>
                    <Input
                      id="analysisEndDate"
                      type="date"
                      {...field}
                      placeholder="Enter analysis end date"
                      error={errors.analysisEndDate?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="totalDepositsAUD"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="totalDepositsAUD">
                      Total Deposits (AUD)
                    </Label>
                    <Input
                      id="totalDepositsAUD"
                      {...field}
                      placeholder="Enter total deposits"
                      error={errors.totalDepositsAUD?.message}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="totalWithdrawalsUSDT"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="totalWithdrawalsUSDT">
                      Total Withdrawals (USDT)
                    </Label>
                    <Input
                      id="totalWithdrawalsUSDT"
                      {...field}
                      placeholder="Enter total withdrawals"
                      error={errors.totalWithdrawalsUSDT?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="totalWithdrawalsETH"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="totalWithdrawalsETH">
                      Total Withdrawals (ETH)
                    </Label>
                    <Input
                      id="totalWithdrawalsETH"
                      {...field}
                      placeholder="Enter total withdrawals"
                      error={errors.totalWithdrawalsETH?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="totalWithdrawalsBTC"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="totalWithdrawalsBTC">
                      Total Withdrawals (BTC)
                    </Label>
                    <Input
                      id="totalWithdrawalsBTC"
                      {...field}
                      placeholder="Enter total withdrawals"
                      error={errors.totalWithdrawalsBTC?.message}
                    />
                  </div>
                )}
              />
            </div>
            <Controller
              control={control}
              name="depositDetails"
              render={({ field }) => (
                <div>
                  <Label htmlFor="depositDetails">Deposit Details</Label>
                  <Textarea
                    id="depositDetails"
                    {...field}
                    placeholder="Enter deposit details"
                    error={errors.depositDetails?.message}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="withdrawalDetails"
              render={({ field }) => (
                <div>
                  <Label htmlFor="withdrawalDetails">Withdrawal Details</Label>
                  <Textarea
                    id="withdrawalDetails"
                    {...field}
                    placeholder="Enter withdrawal details"
                    error={errors.withdrawalDetails?.message}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="transactionAnalysis"
              render={({ field }) => (
                <div>
                  <Label htmlFor="transactionAnalysis">
                    Transaction Analysis
                  </Label>
                  <Textarea
                    id="transactionAnalysis"
                    {...field}
                    placeholder="Enter transaction analysis"
                    error={errors.transactionAnalysis?.message}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="additionalInfo"
              render={({ field }) => (
                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    {...field}
                    placeholder="Enter additional information"
                    error={errors.additionalInfo?.message}
                  />
                </div>
              )}
            />
          </div>
        </Card>

        {/* Section 7: Behavioral Analysis */}
        <Card className="border   p-6 mb-6">
          <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
            7. Behavioral Analysis
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="ipLocations"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="ipLocations">Number of IP Locations</Label>
                    <Input
                      id="ipLocations"
                      type="number"
                      {...field}
                      placeholder="Enter number of IP locations"
                      error={errors.ipLocations?.message}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="registeredAddress"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="registeredAddress">
                      Registered Address
                    </Label>
                    <Input
                      id="registeredAddress"
                      {...field}
                      placeholder="Enter registered address"
                      error={errors.registeredAddress?.message}
                    />
                  </div>
                )}
              />
            </div>
            <Controller
              control={control}
              name="behavioralAnalysis"
              render={({ field }) => (
                <div>
                  <Label htmlFor="behavioralAnalysis">
                    Behavioral Analysis
                  </Label>
                  <Textarea
                    id="behavioralAnalysis"
                    {...field}
                    placeholder="Enter behavioral analysis"
                    error={errors.behavioralAnalysis?.message}
                  />
                </div>
              )}
            />
          </div>
        </Card>

        {/* Section 8: Recommendation */}
        <Card className="border   p-6 mb-6">
          <h2 className="text-2xl font-bold  text-zinc-700 mb-6">
            8. Recommendation
          </h2>
          <Controller
            control={control}
            name="recommendation"
            render={({ field }) => (
              <div>
                <Label htmlFor="recommendation">Recommendation</Label>
                <Textarea
                  id="recommendation"
                  {...field}
                  placeholder="Enter recommendation"
                  error={errors.recommendation?.message}
                />
              </div>
            )}
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={handleSubmit(handleSave)}
            size="lg"
            variant="outline"
            className="border   bg-transparent"
            disabled={loading}
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              'Save Progress'
            )}
          </Button>
          {/* <Button
          onClick={handleExport}
          size="lg"
          variant="outline"
          className="border   bg-transparent"
        >
          <Download className="w-5 h-5 mr-2" />
          Export JSON
        </Button> */}
          {/* <Button
            onClick={handleGenerateReport}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Generate Report
          </Button> */}
          {caseNumber ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className={'border bg-transparent'}
                onClick={() =>
                  router.push(
                    `/dashboard/client/report-compliance/smr-filing/smr/form?caseNumber=${caseNumber}`
                  )
                }
              >
                <FileText className="w-5 h-5 mr-2 text-destructive" />
                SMR
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={'border bg-transparent'}
              >
                <FileText className="w-5 h-5 mr-2 text-destructive" /> RFI
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={'border bg-transparent'}
              >
                <FileSpreadsheet className="w-5 h-5 mr-2 text-destructive" />{' '}
                GFS
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </UILoader>
  );
}
