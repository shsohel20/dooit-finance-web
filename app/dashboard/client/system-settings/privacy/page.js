'use client';

import { useState } from 'react';
import { Edit2, Trash2, Download } from 'lucide-react';
import PrivacyTabs from './tabs';

const CompliancePage = () => {
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
    <div>
      <PrivacyTabs />
    </div>
  );
};

export default CompliancePage;
