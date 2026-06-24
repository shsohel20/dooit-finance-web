/** Deep forest green from reference UI */
export const ONBOARDING_GREEN = "#1B4332";

export const onboardingPrimaryButtonClass =
  "w-full h-12 rounded-full text-base font-semibold bg-[#1B4332] text-white hover:bg-[#163529] border-0 shadow-none";

export const onboardingSecondaryButtonClass =
  "w-full h-12 rounded-full text-base font-semibold bg-neutral-100 text-neutral-900 hover:bg-neutral-200/90 border-0 shadow-none";

export const onboardingBackButtonClass =
  "inline-flex h-11 items-center gap-1 rounded-full border border-[#1B4332]/20 bg-[#1B4332]/[0.06] px-4 text-sm font-semibold text-[#1B4332] shadow-sm transition-all hover:border-[#1B4332]/35 hover:bg-[#1B4332]/10 active:scale-[0.98]";

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
