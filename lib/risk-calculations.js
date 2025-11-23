

// Matrix A: Inherent Risk Rating (Likelihood × Impact)
const INHERENT_RISK_MATRIX = {
  "Almost Certain": {
    Insignificant: "Medium",
    Minor: "High",
    Moderate: "Very High",
    Major: "Critical",
    Catastrophic: "Critical",
  },
  Likely: {
    Insignificant: "Medium",
    Minor: "High",
    Moderate: "High",
    Major: "Very High",
    Catastrophic: "Critical",
  },
  Possible: {
    Insignificant: "Low",
    Minor: "Medium",
    Moderate: "High",
    Major: "Very High",
    Catastrophic: "Critical",
  },
  Unlikely: {
    Insignificant: "Low",
    Minor: "Low",
    Moderate: "Medium",
    Major: "High",
    Catastrophic: "Very High",
  },
  Rare: {
    Insignificant: "Low",
    Minor: "Low",
    Moderate: "Medium",
    Major: "High",
    Catastrophic: "Very High",
  },
}

// Matrix B: Residual Risk Rating (Inherent Risk × Control Assessment)
const RESIDUAL_RISK_MATRIX = {
  Critical: {
    Excellent: "High",
    Good: "High",
    Adequate: "Very High",
    Poor: "Critical",
    Deficient: "Critical",
  },
  "Very High": {
    Excellent: "Medium",
    Good: "High",
    Adequate: "High",
    Poor: "Very High",
    Deficient: "Very High",
  },
  High: {
    Excellent: "Low",
    Good: "Medium",
    Adequate: "High",
    Poor: "High",
    Deficient: "High",
  },
  Medium: {
    Excellent: "Low",
    Good: "Low",
    Adequate: "Medium",
    Poor: "Medium",
    Deficient: "Medium",
  },
  Low: {
    Excellent: "Low",
    Good: "Low",
    Adequate: "Low",
    Poor: "Low",
    Deficient: "Low",
  },
}

// Risk Rating Scores
const RISK_SCORES = {
  Low: 1,
  Medium: 2,
  High: 3,
  "Very High": 4,
  Critical: 5,
}

export function calculateInherentRisk(likelihood, impact) {
  return INHERENT_RISK_MATRIX[likelihood][impact]
}

export function calculateResidualRisk(
  inherentRisk,
  controlAssessment,
) {
  return RESIDUAL_RISK_MATRIX[inherentRisk][controlAssessment]
}

export function getRiskScore(rating) {
  return RISK_SCORES[rating]
}

export function calculateAggregateScore(scores) {
  if (scores.length === 0) return 0
  return Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1))
}

export function getRiskRatingFromScore(score) {
  if (score <= 1.5) return "Low"
  if (score <= 2.5) return "Medium"
  if (score <= 3.5) return "High"
  if (score <= 4.5) return "Very High"
  return "Critical"
}
