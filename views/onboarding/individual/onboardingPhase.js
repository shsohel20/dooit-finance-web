/** Maps the 14 onboarding steps to 4 high-level phases for the progress bar. */
export function getOnboardingPhase(step) {
  const s = Number(step) || 1;
  if (s <= 2) return 1;
  if (s <= 6) return 2;
  if (s <= 12) return 3;
  return 4;
}
