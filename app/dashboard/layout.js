"use client";
import { useState } from "react";

export default function DashboardLayout( {
  children,
  isComponentLoading = false,
  title = "Dashbarod",
} ) {
  const [sidebarOpen, setSidebarOpen] = useState( false );

  const onSidebar = ( condition ) => {
    setSidebarOpen( condition );
  };
  const backTop = () => {
    window.scroll( { behavior: "smooth", top: 0 } );
  };

  return (
    <>{children}</>
  );
}
