'use client';

import { useState } from 'react';
import { ChevronDown, Edit2, Trash2, Plus } from 'lucide-react';
import RiskParametersPage from './tabs/RiskParameter';
import ScoringRules from './tabs/ScoringRules';
import RiskThresholdsPage from './tabs/RiskThreshold';
import ScoringChangeHistory from './tabs/History';

export default function ScoringConfigurationPage() {
  const [activeTab, setActiveTab] = useState('scoring-rules');
  const [rules, setRules] = useState([
    { id: '025890', name: 'Transaction Frequency', category: 'Transaction Risk', status: 'Active' },
    { id: '025896', name: 'Geographic Risk', category: 'Location Risk', status: 'Active' },
    { id: '025896', name: 'PEP Identification', category: 'Customer Risk', status: 'Active' },
  ]);

  return (
    <div className="min-h-screen bg-white p-8 blurry-overlay">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-6">Scoring Configuration</h1>

          {/* Status Summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Rules</p>
                <p className="text-lg font-semibold text-black">12</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-lg font-semibold text-black">9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-8">
          <div className="flex gap-8">
            {[
              { id: 'scoring-rules', label: 'Scoring Rules' },
              { id: 'risk-parameters', label: 'Risk Parameters' },
              { id: 'risk-thresholds', label: 'Risk Thresholds' },
              { id: 'change-history', label: 'Change History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scoring Rules Tab */}
        {activeTab === 'scoring-rules' && (
          <ScoringRules />
        )}

        {activeTab === 'risk-parameters' && (
          <RiskParametersPage />
        )}
        {activeTab === 'risk-thresholds' && (
          <RiskThresholdsPage />
        )}
        {activeTab === 'change-history' && (
          <ScoringChangeHistory />
        )}
      </div>
    </div>
  );
}
