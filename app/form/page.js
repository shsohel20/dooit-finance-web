import Link from "next/link";

export default function AllForm() {
  return (
    <div>
      <div className="flex justify-center flex-wrap gap-4 items-center py-60 font-medium">
        <Link
          href="/form/kyc-onboarding"
          className="hover:text-gray-700 bg-amber-200 p-2 rounded-xl"
        >
          Personal Form
        </Link>
        <Link
          href="/form/kyc-onboarding"
          className="hover:text-gray-700 bg-amber-200 p-2 rounded-xl"
        >
          Company Form
        </Link>
        <Link
          href="/form/kyc-onboarding"
          className="hover:text-gray-700 bg-amber-200 p-2 rounded-xl"
        >
          Non-individual Form
        </Link>
        <Link
          href="/form/kyc-onboarding"
          className="hover:text-gray-700 bg-amber-200 p-2 rounded-xl"
        >
          Trust Form
        </Link>
      </div>
    </div>
  );
}
