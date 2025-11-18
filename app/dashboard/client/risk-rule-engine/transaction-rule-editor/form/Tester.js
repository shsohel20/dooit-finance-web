'use client';

import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomInput from '@/components/ui/CustomInput';
import CustomSelect from '@/components/ui/CustomSelect';

export default function RuleTesterPage() {
  const [testData, setTestData] = useState({
    transactionAmount: '',
    currency: 'USD',
    transactionType: 'transfer',
    country: 'US',
    riskCategory: 'low',
    pepStatus: 'no',
  });

  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTest = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTestResult({
      passed: true,
      message: 'Rule test passed successfully. No compliance violations detected.',
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-2xl ">
      <div className="">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Rule Tester</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Test how your rules apply to specific transaction scenarios
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8 space-y-6 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>

              <CustomInput
                label="Transaction Amount"
                type="number"
                value={testData.transactionAmount}
                onChange={(e) =>
                  setTestData({
                    ...testData,
                    transactionAmount: e.target.value,
                  })
                }
                placeholder="e.g. 10000"

              />
            </div>
            <div>

              <CustomSelect
                label="Currency"
                value={testData.currency}
                onChange={(data) =>
                  setTestData({
                    ...testData,
                    currency: data,
                  })
                }
                options={[
                  { label: 'USD', value: 'USD' },
                  { label: 'EUR', value: 'EUR' },
                  { label: 'GBP', value: 'GBP' },
                ]}
              />


            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>

              <CustomSelect
                label="Transaction Type"
                value={testData.transactionType}
                onChange={(data) =>
                  setTestData({
                    ...testData,
                    transactionType: data,
                  })
                }
                options={[
                  { label: 'Transfer', value: 'transfer' },
                  { label: 'Payment', value: 'payment' },
                  { label: 'Withdrawal', value: 'withdrawal' },
                ]}
              />
            </div>
            <div>
              <CustomSelect
                label="Country"
                value={testData.country}
                onChange={(data) =>
                  setTestData({
                    ...testData,
                    country: data,
                  })
                }
                options={[
                  { label: 'United States', value: 'US' },
                  { label: 'United Kingdom', value: 'UK' },
                  { label: 'Canada', value: 'CA' },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <CustomSelect
                label="Risk Category"
                value={testData.riskCategory}
                onChange={(data) =>
                  setTestData({
                    ...testData,
                    riskCategory: data,
                  })
                }
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
              />
            </div>
            <div>
              <CustomSelect
                label="PEP Status"
                value={testData.pepStatus}
                onChange={(data) =>
                  setTestData({
                    ...testData,
                    pepStatus: data,
                  })
                }
                options={[
                  { label: 'No', value: 'no' },
                  { label: 'Yes', value: 'yes' },
                ]}
              />

            </div>
          </div>
        </div>

        {/* Run Test Button */}
        <div className="mb-8">
          <button
            onClick={handleRunTest}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <PlayCircle size={18} />
            {isLoading ? 'Running Test...' : 'Run Test'}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`rounded-lg border p-6 ${testResult.passed
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
              }`}
          >
            <h3 className={`font-medium ${testResult.passed ? 'text-green-900' : 'text-red-900'}`}>
              Test Result
            </h3>
            <p
              className={`mt-2 text-sm ${testResult.passed ? 'text-green-700' : 'text-red-700'
                }`}
            >
              {testResult.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
