'use client';

import { useState } from 'react';
import { Trash2, Download, MoreVertical } from 'lucide-react';

export default function DataPurgeStatistics() {
  const [settings, setSettings] = useState({
    retentionPeriod: '90',
    autoDelete: 'enabled',
    deleteSchedule: 'monthly',
    retentionReports: 'monthly',
  });

  const policies = [
    {
      id: 1,
      name: 'Customer Personal',
      description: 'Includes contact information, identification documents',
      status: 'Active',
      compliance: 70,
    },
    {
      id: 2,
      name: 'Financial Transactions',
      description: 'Includes payment records, transaction history, account statements',
      status: 'Active',
      compliance: 45,
    },
    {
      id: 3,
      name: 'Communication Records',
      description: 'Includes emails, chat logs, customer support tickets',
      status: 'Active',
      compliance: 85,
    },
  ];

  const stats = [
    { label: 'Records Purged (Last 30 Days)', value: '2.4M', link: true },
    { label: 'Customer Data', value: '1.2M' },
    { label: 'Transaction Data', value: '0.8M' },
    { label: 'Transaction Data', value: '0.4M' },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Data Purge Statistics</h1>
          <p className="text-gray-600">Manage data lifecycle and retention policies</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-yellow-50 border border-yellow-100 rounded-lg p-6"
            >
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="text-3xl font-bold text-black">
                {stat.link ? (
                  <a href="#" className="text-blue-600 hover:underline">
                    {stat.value}
                  </a>
                ) : (
                  stat.value
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Retention Policies */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-black mb-6">Data Retention Policies</h2>
            <div className="space-y-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-black">{policy.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {policy.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600">
                        {policy.compliance}% of data falls within retention period
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        {policy.compliance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${policy.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Settings */}
          <div>
            <h2 className="text-xl font-bold text-black mb-6">Data Retention Policies</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Default Retention Period
                </label>
                <select
                  value={settings.retentionPeriod}
                  onChange={(e) =>
                    setSettings({ ...settings, retentionPeriod: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Automatic Deletion
                </label>
                <select
                  value={settings.autoDelete}
                  onChange={(e) => setSettings({ ...settings, autoDelete: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Deletion Schedule
                </label>
                <select
                  value={settings.deleteSchedule}
                  onChange={(e) =>
                    setSettings({ ...settings, deleteSchedule: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Retention Reports
                </label>
                <select
                  value={settings.retentionReports}
                  onChange={(e) =>
                    setSettings({ ...settings, retentionReports: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-6">
                Update Setting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
