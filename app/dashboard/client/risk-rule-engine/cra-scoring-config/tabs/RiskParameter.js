'use client';

import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

export default function RiskParametersPage() {
  const [activeTab, setActiveTab] = useState('parameters');

  const parameters = [
    {
      id: 'P001',
      name: 'Transaction Count Threshold',
      defaultValue: 50,
      dataType: 'Integer',
      minValue: 10,
      maxValue: 200,
    },
    {
      id: 'P001',
      name: 'High Risk Country Factor',
      defaultValue: 50,
      dataType: 'Integer',
      minValue: 10,
      maxValue: 200,
    },
    {
      id: 'P001',
      name: 'PEP Risk Multiplier',
      defaultValue: 50,
      dataType: 'Integer',
      minValue: 10,
      maxValue: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="py-0">
        {/* Header */}
        <div className="">
          <div>
            <div className="flex justify-end mb-6">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors">
                Add Parameter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-black">Parameter ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Parameter Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Default Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Data Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Min Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Max Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-black"></th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-black">{param.id}</td>
                      <td className="py-4 px-4 text-black">{param.name}</td>
                      <td className="py-4 px-4 text-black">{param.defaultValue}</td>
                      <td className="py-4 px-4 text-black">{param.dataType}</td>
                      <td className="py-4 px-4 text-black">{param.minValue}</td>
                      <td className="py-4 px-4 text-black">{param.maxValue}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-200 rounded transition-colors" aria-label="Edit">
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded transition-colors" aria-label="Delete">
                            <Trash className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {/* Placeholder for other tabs */}
          {activeTab !== 'parameters' && (
            <div className="py-12 text-center text-gray-500">
              <p>Content for {activeTab === 'rules' ? 'Scoring Rules' : activeTab === 'thresholds' ? 'Risk Thresholds' : 'Change History'} coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
