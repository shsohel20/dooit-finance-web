'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Download,
  Calculator,
  FileText,
  Save,
  Loader2,
} from 'lucide-react';
import { cn, riskLevelVariants } from '@/lib/utils';
import { IconPennant } from '@tabler/icons-react';
import { Badge } from '../ui/badge';
import { FormField } from '../ui/FormField';
import { useForm } from 'react-hook-form';
import {
  calculateRiskScore,
  getAllAssessments,
  getCustomers,
  getRiskFactors,
  saveResult,
} from '@/app/dashboard/client/risk-assessment/actions';
import { toast } from 'sonner';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import CustomResizableTable from '../ui/CustomResizable';

const initialValues = {
  customerId: '',
  name: '',
  type: '',
  country: '',
  metadata: {
    product: '',
    channel: '',
    occupation: '',
    industry: '',
  },
  retention: '',
  // "createdAt": "2021-05-01T00:00:00.000Z" //
};
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A28BFE',
  '#FE6F91',
  '#6BCB77',
];

const ScoreCard = ({ name, item }) => {
  return (
    <div
      className={cn(' rounded-md p-4 max-w-sm w-full', {
        'bg-red-50': item?.score === 100,
        'bg-yellow-50': item?.score > 80 && item?.score < 100,
        'bg-orange-50': item?.score > 60 && item?.score < 80,
        'bg-orange-50': item?.score > 40 && item?.score < 60,
        'bg-amber-50': item?.score > 20 && item?.score < 40,
        'bg-blue-50': item?.score > 10 && item?.score <= 20,
        'bg-green-50': item?.score <= 10,
      })}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-bold text-gray-700">{name}</span>
          <p className=" text-gray-600">{item?.value}</p>
        </div>
        <Badge
          className={cn('text-white', {
            'bg-red-500': item?.score === 100,
            'bg-yellow-500': item?.score > 80 && item?.score < 100,
            'bg-orange-500': item?.score > 60 && item?.score < 80,
            'bg-orange-500': item?.score > 40 && item?.score < 60,
            'bg-amber-500': item?.score > 20 && item?.score < 40,
            'bg-blue-500': item?.score > 10 && item?.score <= 20,
            'bg-green-500': item?.score <= 10,
          })}
          variant={riskLevelVariants[item?.score]}
        >
          Score: {item?.score}
        </Badge>
      </div>
    </div>
  );
};
export function CustomerRiskAssessment() {
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [customerTypesOptions, setCustomerTypesOptions] = useState([]);
  const [jurisdictionsOptions, setJurisdictionsOptions] = useState([]);
  const [customerRetentionsOptions, setCustomerRetentionsOptions] = useState(
    []
  );
  const [productsOptions, setProductsOptions] = useState([]);
  const [channelsOptions, setChannelsOptions] = useState([]);
  const [occupationsOptions, setOccupationsOptions] = useState([]);
  const [industriesOptions, setIndustriesOptions] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [customerData, setCustomerData] = useState({
    customerName: '',
    customerId: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    customerType: { value: '', score: 0 },
    jurisdiction: { value: '', score: 0 },
    customerRetention: { value: '', score: 0 },
    product: { value: '', score: 0 },
    channel: { value: '', score: 0 },
    occupation: { value: '', score: 0 },
    industry: { value: '', score: 0 },
    totalScore: 0,
    riskLevel: 'Low',
  });

  const [data, setData] = useState([]);
  const [riskFactors, setRiskFactors] = useState({});
  const [customerOptions, setCustomerOptions] = useState([]);
  const form = useForm({
    defaultValues: initialValues,
  });

  const fetchRiskFactors = async () => {
    const response = await getRiskFactors();
    console.log('response risk factors', response?.data);
    const countries = response.data.countries.map((item) => ({
      label: item.country,
      value: item.country,
    }));
    setCountriesOptions(countries);
    const customerTypes = response.data.customerType.map((item) => ({
      label: item.value.split('_').join(' '),
      value: item.value,
    }));
    setCustomerTypesOptions(customerTypes);
    const jurisdictions = response.data.jurisdiction.map((item) => ({
      label: item.value,
      value: item.value,
    }));
    setJurisdictionsOptions(jurisdictions);
    const customerRetentions = response.data.customerRetention.map((item) => ({
      label: item.value,
      value: item.value,
    }));
    setCustomerRetentionsOptions(customerRetentions);
    const products = response.data.product.map((item) => ({
      label: item.value,
      value: item.value,
    }));
    setProductsOptions(products);
    const channels = response.data.channel.map((item) => ({
      label: item.value,
      value: item.value,
    }));
    setChannelsOptions(channels);
    const occupations = response.data.occupation.map((item) => ({
      label: item.value,
      value: item.value,
    }));
    setOccupationsOptions(occupations);
    const industries = response.data.industry.map((item) => ({
      label: item.value.split('_').join(' '),
      value: item.value,
    }));
    setIndustriesOptions(industries);
  };

  useEffect(() => {
    fetchRiskFactors();
  }, []);

  const calculateTotalScore = () => {
    const total =
      customerData.customerType.score +
      customerData.jurisdiction.score +
      customerData.customerRetention.score +
      customerData.product.score +
      customerData.channel.score +
      customerData.occupation.score +
      customerData.industry.score;

    let riskLevel = 'Low';
    if (total >= 1000) riskLevel = 'Unacceptable';
    else if (total >= 21) riskLevel = 'High';
    else if (total >= 18) riskLevel = 'Medium';
    else riskLevel = 'Low';

    const newData = { ...customerData, totalScore: total, riskLevel };

    setData([...data, newData]);
  };

  const handleFactorChange = (factor, value, score) => {
    setCustomerData({
      ...customerData,
      [factor]: { value, score },
    });
  };

  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'unacceptable':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(customerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CRA_${customerData.customerId || 'assessment'}_${
      new Date().toISOString().split('T')[0]
    }.json`;
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result);
          setCustomerData(data);
        } catch (error) {
          console.error('[v0] Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const generateReport = () => {
    const report = `
CUSTOMER RISK ASSESSMENT REPORT
================================

// Assessment Date: ${customerData.assessmentDate}
Customer Name: ${customerData.customerName}
Customer ID: ${customerData.customerId}

RISK FACTORS
------------
Customer Type: ${customerData.customerType.value} (Score: ${
      customerData.customerType.score
    })
Jurisdiction: ${customerData.jurisdiction.value} (Score: ${
      customerData.jurisdiction.score
    })
Customer Retention: ${customerData.customerRetention.value} (Score: ${
      customerData.customerRetention.score
    })
Product/Service: ${customerData.product.value} (Score: ${
      customerData.product.score
    })
Channel: ${customerData.channel.value} (Score: ${customerData.channel.score})
Occupation: ${customerData.occupation.value} (Score: ${
      customerData.occupation.score
    })
Industry: ${customerData.industry.value} (Score: ${customerData.industry.score})

ASSESSMENT RESULT
-----------------
Total Risk Score: ${customerData.totalScore}
Risk Level: ${customerData.riskLevel}

Risk Classification:
- Low Risk: < 18 (Standard due diligence)
- Medium Risk: 18-20 (Enhanced monitoring)
- High Risk: 21+ (Enhanced due diligence)
- Unacceptable: 1000+ (Decline or exit)

Generated: ${new Date().toISOString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CRA_Report_${customerData.customerId || 'assessment'}_${
      new Date().toISOString().split('T')[0]
    }.txt`;
    link.click();
  };
  const columns = [
    {
      header: 'Customer Name',
      accessorKey: 'customerName',
    },
    {
      header: 'Total Risk Score',
      accessorKey: 'totalScore',
      cell: ({ row }) => {
        const data = row.original.assessment;
        return (
          <div>
            {data.channel.score +
              data.jurisdiction.score +
              data.customerRetention.score +
              data.product.score +
              data.occupation.score +
              data.industry.score}
          </div>
        );
      },
    },
    {
      header: 'Risk Level',
      accessorKey: 'riskLevel',
      cell: ({ row }) => {
        return (
          <Badge variant={riskLevelVariants[row.original.riskLevel]}>
            <IconPennant />
            {row.original.riskLevel} Risk
          </Badge>
        );
      },
    },
    // {
    //   header: 'Assessment Date',
    //   accessorKey: 'assessmentDate',
    // },
    {
      header: 'Customer Type',
      accessorKey: 'assessment.customerType.value',
    },
    {
      header: 'Jurisdiction',
      accessorKey: 'assessment.jurisdiction.value',
    },
    {
      header: 'Customer Retention',
      accessorKey: 'assessment.customerRetention.value',
    },
    {
      header: 'Product/Service',
      accessorKey: 'assessment.product.value',
    },
    {
      header: 'Channel',
      accessorKey: 'assessment.channel.value',
    },
    {
      header: 'Occupation',
      accessorKey: 'assessment.occupation.value',
    },
    {
      header: 'Industry',
      accessorKey: 'assessment.industry.value',
    },
  ];

  const fetchCustomers = async (query) => {
    const response = await getCustomers(query);
    const options = response.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    setCustomerOptions(options);
    return options;
  };

  const handleCalculateRiskScore = async (data) => {
    setIsCalculating(true);
    const selectedCustomer = customerOptions.find(
      (option) => option.value === data.customerId
    );
    const payload = {
      ...data,
      name: selectedCustomer.label,
    };
    const response = await calculateRiskScore(payload);
    console.log(
      'response',
      JSON.stringify(response.data?.riskAssessment, null, 2)
    );
    if (response.success) {
      setCalculationResult(response.data?.riskAssessment);
      // calculateTotalScore();
    } else {
      toast.error('Failed to calculate risk score');
    }
    setIsCalculating(false);
  };
  const pieData = Object.entries(calculationResult || {}).map(
    ([key, item]) => ({
      name: key,
      value: item.score,
    })
  );
  const handleSaveResult = async (data) => {
    setIsSaving(true);
    const selectedCustomer = customerOptions.find(
      (option) => option.value === data.customerId
    );
    const payload = {
      ...data,
      name: selectedCustomer.label,
    };
    const response = await saveResult(payload);
    console.log('response save result', response);
    if (response.success) {
      form.reset();
      setCalculationResult(null);
      const response = await getAllAssessments();
      console.log('response all assessments', response);
      setData(response.data);
      toast.success('Result saved successfully');
    } else {
      toast.error('Failed to save result');
    }
    setIsSaving(false);
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Risk Assessment</CardTitle>
              <CardDescription>
                Evaluate customer risk based on Basel AML Index, AUSTRAC
                guidelines, and ANZSCO/ANZSIC classifications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {customerData.totalScore > 0 && (
                <Button variant="outline" size="sm" onClick={generateReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            <FormField
              form={form}
              name="customerId"
              label="Customer Name"
              type="select"
              placeholder="Enter customer name"
              onAsyncSearch={fetchCustomers}
              isAsync={true}
            />

            {/* <div className="space-y-2">
              <Label>Customer ID</Label>
              <Input
                value={customerData.customerId}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    customerId: e.target.value,
                  })
                }
                placeholder="Enter customer ID"
              />
            </div> */}

            <FormField
              form={form}
              name="metadata.product"
              type="select"
              placeholder="Select product"
              options={productsOptions}
              label="Product/Service"
            />
            <FormField
              form={form}
              name="metadata.channel"
              type="select"
              placeholder="Select channel"
              options={channelsOptions}
              label="Channel"
            />
            <FormField
              form={form}
              name="metadata.occupation"
              type="select"
              placeholder="Select occupation"
              options={occupationsOptions}
              label="Occupation"
            />
            <FormField
              form={form}
              name="metadata.industry"
              type="select"
              placeholder="Select industry"
              options={industriesOptions}
              label="Industry"
            />
            <FormField
              form={form}
              name="country"
              type="select"
              placeholder="Select country"
              options={countriesOptions}
              label="Country"
            />
            <FormField
              form={form}
              name="type"
              type="select"
              placeholder="Select customer type"
              options={customerTypesOptions}
              label="Customer Type"
            />

            <FormField
              form={form}
              name="retention"
              type="select"
              placeholder="Select customer retention"
              options={customerRetentionsOptions}
              label="Customer Retention"
            />
          </div>

          <div className="flex items-center justify-center">
            <Button
              onClick={form.handleSubmit(handleCalculateRiskScore)}
              size="sm"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Risk Score
                </>
              )}
            </Button>
          </div>

          {data.length > 0 && (
            <CustomResizableTable
              mainClass="risk-assessment-table"
              tableId="1111"
              data={data}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>
      {calculationResult && (
        <div className="flex gap-4">
          <Card className={'w-1/2'}>
            <CardHeader>
              <CardTitle>Risk Assessment Result</CardTitle>
            </CardHeader>
            <CardContent className={'relative'}>
              <Button
                variant={'outline '}
                size={'sm'}
                onClick={form.handleSubmit(handleSaveResult)}
                disabled={isSaving}
                className={'absolute -top-10 right-4 border'}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <Save /> Save Result
                  </>
                )}
              </Button>
              <div className=" ">
                <div className="space-y-2 flex-shrink-0 ">
                  <ScoreCard
                    name="Customer Type"
                    item={calculationResult.customerType}
                  />
                  <ScoreCard
                    name="Jurisdiction"
                    item={calculationResult.jurisdiction}
                  />
                  <ScoreCard
                    name="Customer Retention"
                    item={calculationResult.customerRetention}
                  />
                  <ScoreCard
                    name="Product/Service"
                    item={calculationResult.product}
                  />
                  <ScoreCard name="Channel" item={calculationResult.channel} />
                  <ScoreCard
                    name="Occupation"
                    item={calculationResult.occupation}
                  />
                  <ScoreCard
                    name="Industry"
                    item={calculationResult.industry}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={'w-1/2'}>
            <CardContent>
              <div className="flex items-center justify-center">
                <PieChart width={400} height={400}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
