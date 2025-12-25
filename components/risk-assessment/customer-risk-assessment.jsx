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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Upload, Download, Calculator, FileText } from 'lucide-react';
import ResizableTable from '../ui/Resizabletable';
import { riskLevelVariants } from '@/lib/utils';
import { IconPennant } from '@tabler/icons-react';
import { Badge } from '../ui/badge';

export function CustomerRiskAssessment() {
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

  useEffect(() => {
    loadRiskFactors();
  }, []);

  const loadRiskFactors = async () => {
    setRiskFactors({
      customerType: [
        {
          value: 'Government',
          score: 1,
          description: 'LR - Stable and transparent income streams',
        },
        {
          value: 'Individual/Sole proprietorship',
          score: 2,
          description: 'MR - Simple ownership structure',
        },
        {
          value: 'Association/cooperative',
          score: 3,
          description: 'MR - Moderately complex structure',
        },
        {
          value: 'Company/Partnership',
          score: 4,
          description: 'HR - Complex ownership structure',
        },
        {
          value: 'Trust',
          score: 5,
          description: 'HR - Difficult to identify source/destination of funds',
        },
      ],
      jurisdiction: [
        {
          value: 'LRC - Low Risk Country',
          score: 1,
          description: 'Basel AML Index < 4.71',
        },
        {
          value: 'MRC - Medium Risk Country',
          score: 3,
          description: 'Remaining countries',
        },
        {
          value: 'HRC - High Risk Country',
          score: 5,
          description: 'Tax havens, Basel > 6, FATF grey list',
        },
        {
          value: 'UHRC - Ultra High Risk Country',
          score: 100,
          description: 'Sanctioned countries (Unacceptable)',
        },
      ],
      customerRetention: [
        {
          value: '3+ Years',
          score: 1,
          description: 'LR - Established relationship, high understanding',
        },
        {
          value: '1-3 Years',
          score: 2,
          description: 'MR - Moderate understanding',
        },
        { value: 'New', score: 3, description: 'HR - Minimal understanding' },
      ],
      product: [
        { value: 'Custody', score: 2, description: 'MR - Moderate ML/TF risk' },
        {
          value: 'Stable coin',
          score: 3,
          description: 'MR - Moderate exposure',
        },
        { value: 'Affiliate', score: 3, description: 'MR - Moderate risk' },
        {
          value: 'Bullion',
          score: 4,
          description: 'HR - High cash/value exposure',
        },
        {
          value: 'Remittance/FX',
          score: 4,
          description: 'HR - High ML/TF risk',
        },
        { value: 'DCE', score: 5, description: 'HR - Highest ML/TF exposure' },
      ],
      channel: [
        {
          value: 'Face to Face',
          score: 1,
          description: 'LR - Direct verification possible',
        },
        {
          value: 'Direct mobile App',
          score: 3,
          description: 'MR - Instant communication',
        },
        {
          value: 'Customer with agent/authorised representative',
          score: 3,
          description: 'MR - Indirect but verified',
        },
        {
          value: 'Direct messaging App/Email (OTC)',
          score: 4,
          description: 'HR - Limited verification',
        },
        {
          value: 'Customer with broker',
          score: 5,
          description: 'HR - Difficult to verify identity',
        },
      ],
      occupation: [
        {
          value: 'Managers',
          score: 1,
          description: 'LR - Low exposure to cash/crypto/ML/TF',
        },
        { value: 'Professionals', score: 1, description: 'LR - Low exposure' },
        {
          value: 'Clerical and Administrative Workers',
          score: 2,
          description: 'MR - Medium exposure',
        },
        {
          value: 'Technicians and Trades Workers',
          score: 3,
          description: 'MR - Medium exposure',
        },
        {
          value: 'Sales Workers',
          score: 3,
          description: 'MR - Medium exposure',
        },
        {
          value: 'Machinery Operators and Drivers',
          score: 3,
          description: 'MR - Medium exposure',
        },
        {
          value: 'Community and Personal Service Workers',
          score: 4,
          description: 'HR - High exposure',
        },
        { value: 'Labourers', score: 4, description: 'HR - High exposure' },
        {
          value: 'Business Owner',
          score: 4,
          description: 'HR - High exposure',
        },
        {
          value: 'Unemployed/Retiree',
          score: 5,
          description: 'UHR - Highest exposure',
        },
        { value: 'Student', score: 5, description: 'UHR - Highest exposure' },
      ],
      industry: [
        {
          value: 'Electricity, Gas, Water and Waste Services',
          score: 1,
          description: 'LR',
        },
        {
          value: 'Information Media and Telecommunications',
          score: 1,
          description: 'LR',
        },
        {
          value: 'Public Administration and Safety',
          score: 1,
          description: 'LR',
        },
        { value: 'Education and Training', score: 2, description: 'MR' },
        {
          value: 'Health Care and Social Assistance',
          score: 2,
          description: 'MR',
        },
        {
          value: 'Agriculture, Forestry and Fishing',
          score: 3,
          description: 'MR',
        },
        { value: 'Mining', score: 3, description: 'MR' },
        { value: 'Manufacturing', score: 3, description: 'MR' },
        { value: 'Wholesale Trade', score: 3, description: 'MR' },
        {
          value: 'Accommodation and Food Services',
          score: 3,
          description: 'MR',
        },
        {
          value: 'Transport, Postal and Warehousing',
          score: 3,
          description: 'MR',
        },
        {
          value: 'Professional, Scientific and Technical Services',
          score: 3,
          description: 'MR',
        },
        {
          value: 'Administrative and Support Services',
          score: 3,
          description: 'MR',
        },
        { value: 'Retail Trade', score: 4, description: 'HR' },
        { value: 'Arts and Recreation Services', score: 4, description: 'HR' },
        {
          value: 'Construction',
          score: 5,
          description: 'UHR - Highest ML/TF risk',
        },
        {
          value: 'Financial and Insurance Services',
          score: 5,
          description: 'UHR - Highest ML/TF risk',
        },
        {
          value: 'Rental, Hiring and Real Estate Services',
          score: 5,
          description: 'UHR - Highest ML/TF risk',
        },
      ],
    });
  };

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

  console.log('customerData', customerData);

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

Assessment Date: ${customerData.assessmentDate}
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
    {
      header: 'Assessment Date',
      accessorKey: 'assessmentDate',
    },
    {
      header: 'Customer Type',
      accessorKey: 'customerType.value',
    },
    {
      header: 'Jurisdiction',
      accessorKey: 'jurisdiction.value',
    },
  ];

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
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={customerData.customerName}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    customerName: e.target.value,
                  })
                }
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
              <Label>Assessment Date</Label>
              <Input
                type="date"
                value={customerData.assessmentDate}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    assessmentDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <Select
                value={customerData.customerType.value}
                onValueChange={(value) => {
                  const factor = riskFactors.customerType?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange('customerType', value, factor?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.customerType?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.customerType.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.customerType?.find(
                      (f) => f.value === customerData.customerType.value
                    )?.description
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Jurisdiction</Label>
              <Select
                value={customerData.jurisdiction.value}
                onValueChange={(value) => {
                  const factor = riskFactors.jurisdiction?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange('jurisdiction', value, factor?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.jurisdiction?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.jurisdiction.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.jurisdiction?.find(
                      (f) => f.value === customerData.jurisdiction.value
                    )?.description
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Customer Retention</Label>
              <Select
                value={customerData.customerRetention.value}
                onValueChange={(value) => {
                  const factor = riskFactors.customerRetention?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange(
                    'customerRetention',
                    value,
                    factor?.score || 0
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select retention" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.customerRetention?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.customerRetention.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.customerRetention?.find(
                      (f) => f.value === customerData.customerRetention.value
                    )?.description
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Product/Service</Label>
              <Select
                value={customerData.product.value}
                onValueChange={(value) => {
                  const factor = riskFactors.product?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange('product', value, factor?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.product?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.product.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.product?.find(
                      (f) => f.value === customerData.product.value
                    )?.description
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Channel</Label>
              <Select
                value={customerData.channel.value}
                onValueChange={(value) => {
                  const factor = riskFactors.channel?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange('channel', value, factor?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.channel?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.channel.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.channel?.find(
                      (f) => f.value === customerData.channel.value
                    )?.description
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Occupation (ANZSCO)</Label>
              <Select
                value={customerData.occupation.value}
                onValueChange={(value) => {
                  const factor = riskFactors.occupation?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange('occupation', value, factor?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.occupation?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.occupation.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.occupation?.find(
                      (f) => f.value === customerData.occupation.value
                    )?.description
                  }
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label>Industry (ANZSIC)</Label>
              <Select
                value={customerData.industry.value}
                onValueChange={(value) => {
                  const factor = riskFactors.industry?.find(
                    (f) => f.value === value
                  );
                  handleFactorChange('industry', value, factor?.score || 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {riskFactors.industry?.map((factor) => (
                    <SelectItem key={factor.value} value={factor.value}>
                      {factor.value} (Score: {factor.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerData.industry.value && (
                <p className="text-xs text-muted-foreground">
                  {
                    riskFactors.industry?.find(
                      (f) => f.value === customerData.industry.value
                    )?.description
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button onClick={calculateTotalScore} size="lg">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Risk Score
            </Button>
          </div>

          {data.length > 0 && <ResizableTable data={data} columns={columns} />}
        </CardContent>
      </Card>
    </div>
  );
}
