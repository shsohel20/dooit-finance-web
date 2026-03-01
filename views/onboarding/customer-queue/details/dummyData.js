import partyDataJson from "./demo.json";

function flatten(node, parent, out) {
  out.push({
    name: node.partyName,
    partyId: node.partyId,
    partyType: node.partyType,
    role: node.role,
    pepFlag: node.pepFlag ?? false,
    riskRating: node.riskRating,
    status: node.status,
    ipAddress: node.ipAddress,
    parentName: parent,
    relation: node.relationshipToParent ?? "self",
    relationType: node.relationType ?? "FAMILY",
    ownershipPercentage: node.ownershipPercentage,
    nationality: node.nationality,
    dateOfBirth: node.dateOfBirth,
    politicalPosition: node.politicalPosition,
    screeningStatus: node.screeningStatus,
    registeredCountry: node.registeredCountry,
    transactions: node.transactions,
  });
  for (const child of node.children) flatten(child, node.partyName, out);
}

// Cast the JSON data to our PartyNode type
export const dummyData = partyDataJson;

const _flat = [];
flatten(dummyData, null, _flat);
export const flatEntities = _flat;
