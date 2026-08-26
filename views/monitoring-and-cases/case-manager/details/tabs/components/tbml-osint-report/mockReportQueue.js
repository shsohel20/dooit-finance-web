// The "awaiting review" queue and 7-day coverage stats shown in the sidebar.
// The API only returns a single report at a time (see mockTbmlReportData.js),
// so the rest of the queue is placeholder data until a list endpoint exists —
// swap this for a real fetch once that's available.
export const mockReportQueue = [
  {
    reportId: "TBML-DDF975C066E1",
    title: "Invoice 123456 · painting labour & materials",
    riskLevel: "HIGH",
    riskScore: 70,
    productCount: 2,
    tag: "price anomaly",
  },
  {
    reportId: "TBML-C63D18E4B7F9",
    title: "Invoice 90-4417 · semiconductor test sockets",
    riskLevel: "HIGH",
    riskScore: 82,
    productCount: 6,
    tag: "under-invoicing",
  },
  {
    reportId: "TBML-4A17C92B0D33",
    title: "Invoice 88214 · aluminium extrusion profiles",
    riskLevel: "MEDIUM",
    riskScore: 48,
    productCount: 3,
    tag: "route deviation",
  },
  {
    reportId: "TBML-9F02E7541AAC",
    title: "Bill of lading · polypropylene granules",
    riskLevel: "LOW",
    riskScore: 12,
    productCount: 1,
    tag: "no findings",
  },
];

export const mockCoverageStats = {
  documentsScreened: 218,
  productsPriceTestedPct: 94,
  highRiskOpen: 11,
  medianClearanceDays: 1.8,
};
