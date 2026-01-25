import { useSearchParams } from "next/navigation";

export default function PolicyDetails() {
  const id = useSearchParams().get('id');
  return (
    <div>
      <h1>Policy Details</h1>
    </div>
  )
}