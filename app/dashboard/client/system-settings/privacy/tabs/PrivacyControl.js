'use client';

import { useState } from 'react';
import { Edit2, Trash2, Download } from 'lucide-react';

const PrivacyControl = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusCards = [
    { label: 'Data Encryption', status: 'Compliant', color: 'bg-green-50 text-green-700' },
    { label: 'Consent Management', status: 'Compliant', color: 'bg-green-50 text-green-700' },
    { label: 'Privacy Audit', status: 'Review Needed', color: 'bg-orange-50 text-orange-700' },
    { label: 'Data Rights', status: 'Compliant', color: 'bg-green-50 text-green-700' },
  ];

  const controls = [
    {
      title: 'Data Encryption',
      description: 'End-to-end encryption for data at rest and in transit',
      enabled: true,
    },
    {
      title: 'Anonymization',
      description: 'Automatic data anonymization for analytics',
      enabled: true,
    },
    {
      title: 'Anonymization',
      description: 'Automatic data anonymization for analytics',
      enabled: false,
    },
  ];

  const privacyLevels = [
    { label: 'High Sensitivity', percentage: 45, color: 'bg-red-400' },
    { label: 'Medium Sensitivity', percentage: 35, color: 'bg-yellow-400' },
    { label: 'Low Sensitivity', percentage: 20, color: 'bg-green-400' },
  ];

  const activities = [
    {
      id: 1,
      activity: 'Customer Onboarding',
      category: 'Personalization',
      purpose: 'PII Processing',
      basis: 'Legal Mitigation',
      status: 'Audit',
    },
    {
      id: 2,
      activity: 'Customer Onboarding',
      category: 'Personalization',
      purpose: 'PII Processing',
      basis: 'Legal Mitigation',
      status: 'Audit',
    },
    {
      id: 3,
      activity: 'Customer Onboarding',
      category: 'Personalization',
      purpose: 'PII Processing',
      basis: 'Legal Mitigation',
      status: 'Audit',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className=" py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Privacy & Compliance</h1>
          <p className="text-gray-600">Manage data protection controls and privacy policies</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statusCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-300 rounded-lg p-4"
            >
              <p className="text-sm text-gray-600 mb-2">{card.label}</p>
              <p className={`text-lg font-semibold ${card.color} rounded px-2 py-1 inline-block text-sm`}>
                {card.status}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Data Protection Controls */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Data Protection Controls</h2>
            <div className="space-y-4">
              {controls.map((control, idx) => (
                <div key={idx} className="bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{control.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{control.description}</p>
                  </div>
                  <div className="ml-4">
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${control.enabled ? 'bg-primary' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${control.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Level Overview */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">Privacy Level Overview</h2>
            <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
              {privacyLevels.map((level, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-black">{level.label}</p>
                    <p className="text-sm font-semibold text-black">{level.percentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${level.color} h-2 rounded-full`}
                      style={{ width: `${level.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Activity Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Processing Activity</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-500"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-100 transition flex items-center gap-2">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Activity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Purpose</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Legal Basis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-black">{activity.activity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{activity.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{activity.purpose}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{activity.basis}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button className="text-sm text-gray-600 hover:text-black">← Previous</button>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded bg-primary text-white text-xs font-medium">1</button>
              <button className="w-8 h-8 rounded border border-gray-300 text-sm font-medium text-black hover:bg-gray-100">2</button>
              <button className="w-8 h-8 rounded border border-gray-300 text-sm font-medium text-black hover:bg-gray-100">3</button>
              <span className="text-sm text-gray-600">...</span>
              <button className="w-8 h-8 rounded border border-gray-300 text-sm font-medium text-black hover:bg-gray-100">67</button>
              <button className="w-8 h-8 rounded border border-gray-300 text-sm font-medium text-black hover:bg-gray-100">68</button>
            </div>
            <button className="text-sm text-gray-600 hover:text-black">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyControl;
