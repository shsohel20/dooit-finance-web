'use client';
import { Plus, Edit2, Trash2 } from 'lucide-react'
import React, { useState } from 'react'



export default function ScoringRules() {
  const [rules, setRules] = useState([
    { id: '025890', name: 'Transaction Frequency', category: 'Transaction Risk', status: 'Active' },
    { id: '025896', name: 'Geographic Risk', category: 'Location Risk', status: 'Active' },
    { id: '025896', name: 'PEP Identification', category: 'Customer Risk', status: 'Active' },
  ]);

  return (
    <div className="space-y-6">
      {/* Rules Table */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black">Scoring Rules</h2>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-black hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Add Rule
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">Rule ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">Rule Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">Risk Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, idx) => (
              <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-black">{rule.id}</td>
                <td className="px-6 py-4 text-sm text-black">{rule.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{rule.category}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {rule.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-3">
                  <button className="text-gray-500 hover:text-black transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rule Configuration Form */}
      <div className="mt-12 pt-8 border-t border-gray-300">
        <h2 className="text-lg font-semibold text-black mb-6">Rule Configuration</h2>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Rule Name</label>
              <input
                type="text"
                placeholder="Enter rule name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Risk Category</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Select category</option>
                <option>Transaction Risk</option>
                <option>Location Risk</option>
                <option>Customer Risk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Description</label>
            <textarea
              placeholder="Enter rule description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Save and Active
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
