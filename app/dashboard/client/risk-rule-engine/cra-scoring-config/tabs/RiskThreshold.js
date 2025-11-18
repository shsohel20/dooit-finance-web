'use client';

import { useState } from 'react';

export default function RiskThresholdsPage() {
  const [lowRisk, setLowRisk] = useState(30);
  const [mediumRisk, setMediumRisk] = useState(70);
  const [highRisk, setHighRisk] = useState(100);

  const handleUpdate = () => {
    console.log('Thresholds updated:', { lowRisk, mediumRisk, highRisk });
  };

  return (
    <div className="min-h-screen bg-white p-0">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black mb-2">Risk Thresholds</h1>
          <p className="text-gray-600">Configure the score ranges for risk levels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-black mb-6">Risk Threshold Configuration</h2>

              <div className="space-y-6">
                {/* Low Risk Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Low Risk Threshold (0 - X)
                  </label>
                  <input
                    type="number"
                    value={lowRisk}
                    onChange={(e) => setLowRisk(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Medium Risk Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Medium Risk Threshold (X - Y)
                  </label>
                  <input
                    type="number"
                    value={mediumRisk}
                    onChange={(e) => setMediumRisk(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-blue-500 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* High Risk Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    High Risk Threshold (Y - 100)
                  </label>
                  <input
                    type="number"
                    value={highRisk}
                    onChange={(e) => setHighRisk(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdate}
                  className="w-full mt-8 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Threshold
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Risk Breakdown Visualization */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-black mb-6">Risk Breakdown</h2>

              <div className="space-y-6">
                {/* Low Risk */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-black">Low Risk</span>
                    </div>
                    <span className="text-sm text-gray-600">{`0-${lowRisk}`}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(lowRisk / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium text-black">Medium Risk</span>
                    </div>
                    <span className="text-sm text-gray-600">{`${lowRisk + 1}-${mediumRisk}`}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${((mediumRisk - lowRisk) / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* High Risk */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium text-black">High Risk</span>
                    </div>
                    <span className="text-sm text-gray-600">{`${mediumRisk + 1}-100`}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${((100 - mediumRisk) / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
