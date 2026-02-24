export const currentUser = {
  name: 'Sarah Chen',
  role: 'Compliance Officer',
  email: 'sarah.chen@company.com',
};

export const mockExceptions = [
  {
    id: 'EXC-2026-001',
    relatedPolicy: 'AC-2 Account Management',
    description:
      'Temporary exemption from MFA requirement for legacy VPN gateway during migration to zero-trust architecture.',
    riskLevel: 'High',
    businessJustification:
      'Legacy VPN gateway does not support modern MFA protocols. Full migration to zero-trust scheduled for completion Q2 2026.',
    compensatingControls:
      'IP allowlisting, enhanced logging, 24/7 SOC monitoring, reduced session timeout of 15 minutes.',
    approvalStatus: 'Approved',
    approvedBy: 'James Wilson',
    approvalDate: '2026-01-15',
    expiryDate: '2026-06-30',
    status: 'Active',
    createdAt: '2026-01-10',
    reviewReminder: '2026-04-01',
    requestedBy: 'Michael Torres',
  },
  {
    id: 'EXC-2026-002',
    relatedPolicy: 'SC-8 Transmission Confidentiality',
    description:
      'Exception for unencrypted data transfer between internal staging environments.',
    riskLevel: 'Medium',
    businessJustification:
      'Staging environments operate within an isolated network segment with no external access. Encryption overhead impacts CI/CD pipeline performance by 40%.',
    compensatingControls:
      'Network segmentation, VLAN isolation, quarterly penetration testing, data classification limited to non-sensitive test data.',
    approvalStatus: 'Approved',
    approvedBy: 'Sarah Chen',
    approvalDate: '2026-02-01',
    expiryDate: '2026-08-01',
    status: 'Active',
    createdAt: '2026-01-28',
    reviewReminder: '2026-05-15',
    requestedBy: 'David Park',
  },
  {
    id: 'EXC-2026-003',
    relatedPolicy: 'CM-7 Least Functionality',
    description:
      'Exception to allow USB storage devices on engineering workstations for hardware development team.',
    riskLevel: 'Medium',
    businessJustification:
      'Hardware development team requires USB access for firmware programming and device testing. No viable alternative for direct hardware interface.',
    compensatingControls:
      'Endpoint DLP agent, USB device allowlisting, real-time file scanning, audit logging of all USB transfers.',
    approvalStatus: 'Under Review',
    approvedBy: null,
    approvalDate: null,
    expiryDate: '2026-12-31',
    status: 'Active',
    createdAt: '2026-02-14',
    reviewReminder: '2026-09-01',
    requestedBy: 'Linda Martinez',
  },
  {
    id: 'EXC-2025-018',
    relatedPolicy: 'IA-5 Authenticator Management',
    description:
      'Reduced password complexity requirements for shared kiosk accounts in manufacturing floor.',
    riskLevel: 'Low',
    businessJustification:
      'Manufacturing floor kiosks require quick access for shift workers. Complex passwords cause operational delays and workarounds.',
    compensatingControls:
      'Physical access controls to manufacturing area, auto-logout after 5 minutes, restricted network access, no email or internet access.',
    approvalStatus: 'Approved',
    approvedBy: 'James Wilson',
    approvalDate: '2025-06-20',
    expiryDate: '2025-12-31',
    status: 'Expired',
    createdAt: '2025-06-15',
    reviewReminder: '2025-10-01',
    requestedBy: 'Robert Kim',
  },
  {
    id: 'EXC-2025-022',
    relatedPolicy: 'AU-6 Audit Review',
    description:
      'Reduced audit log review frequency from daily to weekly for non-production development environments.',
    riskLevel: 'Low',
    businessJustification:
      'Development environments contain no production data. Daily review is resource-intensive with no security incidents in 18 months.',
    compensatingControls:
      'Automated alerting for critical events, monthly comprehensive review, no production data access from dev environments.',
    approvalStatus: 'Approved',
    approvedBy: 'Sarah Chen',
    approvalDate: '2025-08-10',
    expiryDate: '2026-02-10',
    status: 'Closed',
    createdAt: '2025-08-05',
    reviewReminder: null,
    requestedBy: 'Emily Zhang',
  },
  {
    id: 'EXC-2026-004',
    relatedPolicy: 'SI-3 Malicious Code Protection',
    description:
      'Exception for disabling real-time antivirus scanning on high-performance compute nodes.',
    riskLevel: 'High',
    businessJustification:
      'Real-time scanning reduces compute performance by 35%, directly impacting financial modeling deadlines and client SLAs.',
    compensatingControls:
      'Scheduled full scans during maintenance windows, application allowlisting, network isolation, read-only filesystems where possible.',
    approvalStatus: 'Pending',
    approvedBy: null,
    approvalDate: null,
    expiryDate: '2026-09-30',
    status: 'Active',
    createdAt: '2026-02-20',
    reviewReminder: '2026-06-15',
    requestedBy: 'Thomas Lee',
  },
  {
    id: 'EXC-2026-005',
    relatedPolicy: 'PE-3 Physical Access Control',
    description:
      'Temporary badge access exception for contractor team during office renovation project.',
    riskLevel: 'Low',
    businessJustification:
      'Renovation contractors need after-hours building access for 8 weeks. Normal badging process takes 3 weeks per individual.',
    compensatingControls:
      'Escort policy for server rooms, security camera monitoring, daily access logs reviewed by facilities team, temporary badges with auto-expiry.',
    approvalStatus: 'Approved',
    approvedBy: 'James Wilson',
    approvalDate: '2026-02-18',
    expiryDate: '2026-04-15',
    status: 'Active',
    createdAt: '2026-02-15',
    reviewReminder: '2026-03-30',
    requestedBy: 'Karen White',
  },
  {
    id: 'EXC-2026-006',
    relatedPolicy: 'AC-17 Remote Access',
    description:
      'Exception to allow split-tunnel VPN configuration for executive leadership team.',
    riskLevel: 'Medium',
    businessJustification:
      'Full-tunnel VPN causes significant latency for video conferencing and SaaS applications, impacting executive productivity and client meetings.',
    compensatingControls:
      'EDR agent with enhanced monitoring, DNS-level filtering, cloud proxy for web traffic, device compliance checks before VPN connection.',
    approvalStatus: 'Rejected',
    approvedBy: 'Sarah Chen',
    approvalDate: '2026-02-22',
    expiryDate: '2026-08-22',
    status: 'Closed',
    createdAt: '2026-02-19',
    reviewReminder: null,
    requestedBy: 'Alex Rivera',
  },
];
