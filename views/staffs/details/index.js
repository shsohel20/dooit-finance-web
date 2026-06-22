"use client";
import { getStaffDetails } from "@/app/dashboard/client/staffs/actions";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StaffDetails() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = useSearchParams().get("id");

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const response = await getStaffDetails(id);
      console.log("response", JSON.stringify(response, null, 2));
      setStaff(response.data);
      setLoading(false);
    };
    fetchStaff();
  }, [id]);
  return <div>StaffDetails</div>;
}
