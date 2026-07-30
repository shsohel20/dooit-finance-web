const PARTY_ICON = {
  LEGAL_ENTITY: "🏢",
  INDIVIDUAL: "👤",
  TRUST: "💰",
  BENEFICIARY: "💰",
  LEGAL_STRUCTURE: "🏢",
  Business: "🏢",
  UNKNOWN: "❓",
};

export const getPartyIcon = (partyType) => {
  return PARTY_ICON[partyType] || PARTY_ICON["UNKNOWN"];
};
