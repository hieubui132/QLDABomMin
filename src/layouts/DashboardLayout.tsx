import React from "react";
import Header from "@/layouts/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );
}
