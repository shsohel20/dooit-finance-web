'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";
import Home from "@/views/Home";
export default function HomePage() {
  const { data: session } = useSession();
  return (
    <Home/>
  );
}
