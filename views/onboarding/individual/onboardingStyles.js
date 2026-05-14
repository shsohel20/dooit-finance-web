/** Deep forest green from reference UI */
export const ONBOARDING_GREEN = "#1B4332";

export const onboardingPrimaryButtonClass =
  "w-full h-12 rounded-full text-base font-semibold bg-[#1B4332] text-white hover:bg-[#163529] border-0 shadow-none";

export const onboardingSecondaryButtonClass =
  "w-full h-12 rounded-full text-base font-semibold bg-neutral-100 text-neutral-900 hover:bg-neutral-200/90 border-0 shadow-none";

export const onboardingInputClass =
  "h-12 rounded-full border-neutral-200 px-5 text-base placeholder:text-neutral-400 md:text-base";

export function onboardingSelectControlStyles() {
  return {
    control: (base) => ({
      ...base,
      minHeight: 48,
      borderRadius: 9999,
      borderColor: "#e5e5e5",
      boxShadow: "none",
      fontSize: "1rem",
    }),
    valueContainer: (base) => ({ ...base, paddingLeft: 16, paddingRight: 16 }),
    placeholder: (base) => ({ ...base, color: "#a3a3a3" }),
  };
}
