const partyData = {
  partyId: "P-5000",
  partyName: "Sheikh Hasina",
  partyType: "INDIVIDUAL",
  role: "PRIMARY_PARTY",
  pepFlag: true,
  riskRating: "HIGH",
  status: "ACTIVE",
  ipAddress: "103.21.244.10",
  nationality: "Bangladeshi",
  dateOfBirth: "1947-09-28",
  politicalPosition: "Prime Minister of Bangladesh",
  screeningStatus: "CONFIRMED_PEP",

  transactions: [
    {
      transactionId: "T-1001",
      from: "Hasina Family Trust",
      to: "Sheikh Hasina",
      relationType: "TRANSACTIONAL",
      amount: 1200000,
      currency: "USD",
      frequency: "ANNUAL",
      purpose: "Family support",
      riskFlag: "TRUST_TO_PEP",
      type: "INCOMING",
      dateRange: "2025",
    },
    {
      transactionId: "T-1002",
      from: "Joy Digital Services",
      to: "Sheikh Hasina",
      relationType: "TRANSACTIONAL",
      amount: 300000,
      currency: "USD",
      frequency: "ANNUAL",
      purpose: "Dividend",
      riskFlag: "BUSINESS_TO_PEP",
      type: "INCOMING",
      dateRange: "2025",
    },
  ],

  children: [
    {
      partyId: "P-5001",
      partyName: "Sajeeb Wazed Joy",
      partyType: "INDIVIDUAL",
      role: "IMMEDIATE_FAMILY",
      relationshipToParent: "SON",
      relationType: "FAMILY",
      riskRating: "MEDIUM",
      status: "ACTIVE",
      ipAddress: "103.21.244.21",
      nationality: "Bangladeshi/American",

      transactions: [
        {
          transactionId: "T-2001",
          from: "Sheikh Hasina",
          to: "Sajeeb Wazed Joy",
          relationType: "TRANSACTIONAL",
          amount: 100000,
          currency: "USD",
          frequency: "MONTHLY",
          purpose: "Family support & business income",
          riskFlag: "PEP_FAMILY_TRANSFER",
          type: "INCOMING",
          dateRange: "2025",
        },
        {
          transactionId: "T-2002",
          from: "Joy Digital Services",
          to: "Sajeeb Wazed Joy",
          relationType: "TRANSACTIONAL",
          amount: 115000,
          currency: "USD",
          frequency: "MONTHLY",
          purpose: "Family support & business income",
          riskFlag: "PEP_FAMILY_TRANSFER",
          type: "INCOMING",
          dateRange: "2025",
        },
      ],

      children: [
        {
          partyId: "P-5002",
          partyName: "Rakib Hasan",
          partyType: "INDIVIDUAL",
          role: "CLOSE_ASSOCIATE",
          relationshipToParent: "FRIEND",
          relationType: "SOCIAL",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          ipAddress: "192.168.10.45",

          transactions: [
            {
              transactionId: "T-3001",
              from: "Sajeeb Wazed Joy",
              to: "Rakib Hasan",
              relationType: "TRANSACTIONAL",
              amount: 75000,
              currency: "USD",
              frequency: "MONTHLY",
              purpose: "Consulting & advisory fees",
              riskFlag: "PEP_TO_ASSOCIATE",
              type: "INCOMING",
              dateRange: "2025",
            },
            {
              transactionId: "T-3002",
              from: "Rakib Tech Solutions Ltd",
              to: "Rakib Hasan",
              relationType: "TRANSACTIONAL",
              amount: 87000,
              currency: "USD",
              frequency: "MONTHLY",
              purpose: "Consulting & advisory fees",
              riskFlag: "PEP_TO_ASSOCIATE",
              type: "INCOMING",
              dateRange: "2025",
            },
          ],

          children: [],
        },
      ],
    },
  ],
};

export const nodes = [];
export const links = [];

function buildGraph(party, parent = null) {
  // -------------------------
  // 1. Create party node
  // -------------------------
  const partyNode = {
    id: party.partyId,
    type: "party",

    partyId: party.partyId,
    partyName: party.partyName,
    partyType: party.partyType,
    role: party.role,

    riskRating: party.riskRating,
    status: party.status,

    relationType: party.relationType,
    relationshipToParent: party.relationshipToParent,

    ownershipPercentage: party.ownershipPercentage,

    ipAddress: party.ipAddress,
    nationality: party.nationality,
  };

  nodes.push(partyNode);

  // -------------------------
  // 2. Connect party to parent
  // -------------------------
  if (parent) {
    links.push({
      id: `${parent.partyId}-${party.partyId}`,
      source: parent.partyId,
      target: party.partyId,
      type: "relationship",

      relationType: party.relationType,
      relationship: party.relationshipToParent,
      ownershipPercentage: party.ownershipPercentage,
    });
  }

  // -------------------------
  // 3. Create transaction nodes
  // -------------------------
  party.transactions?.forEach((transaction) => {
    const transactionNode = {
      id: transaction.transactionId,
      type: "transaction",

      transactionId: transaction.transactionId,
      from: transaction.from,
      to: transaction.to,

      amount: transaction.amount,
      currency: transaction.currency,

      frequency: transaction.frequency,
      purpose: transaction.purpose,

      riskFlag: transaction.riskFlag,
      transactionType: transaction.type,

      dateRange: transaction.dateRange,
    };

    nodes.push(transactionNode);

    // Party → Transaction
    links.push({
      id: `${party.partyId}-${transaction.transactionId}`,
      source: party.partyId,
      target: transaction.transactionId,
      type: "transaction",
    });
  });

  // -------------------------
  // 4. Process children
  // -------------------------
  party.children?.forEach((child) => {
    buildGraph(child, party);
  });
}

buildGraph(partyData);

const graphData = {
  nodes,
  links,
};
