'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

const initialPreferences = [
  { id: 1, title: 'Email Notifications', description: 'Receive email notifications for new updates', lastUpdated: '2025-01-01', enabled: true },
  { id: 2, title: 'SMS Notifications', description: 'Receive SMS notifications for new updates', lastUpdated: '2025-01-01', enabled: false },
  { id: 3, title: 'Push Notifications', description: 'Receive push notifications for new updates', lastUpdated: '2025-01-01', enabled: true },
];

export default function ConsentPreferencesPage() {
  const [preferences, setPreferences] = useState(initialPreferences);

  const togglePreference = (id) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Consent Preferences</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your data and privacy preferences</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            Add Processing Activity
          </button>
        </div>

        {/* Preferences List */}
        <div className="space-y-4">
          {preferences.map((preference) => (
            <div
              key={preference.id}
              className="flex items-start justify-between gap-6 rounded-lg border border-gray-200 p-4 hover:border-gray-300"
            >
              <div className="flex-1">
                <h3 className="font-medium text-black">{preference.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{preference.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Last updated: {new Date(preference.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => togglePreference(preference.id)}
                className={`relative mt-1 inline-flex h-6 w-11 items-center rounded-full transition-colors ${preference.enabled ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                aria-pressed={preference.enabled}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${preference.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
