import React from "react";
import Header from "@/layouts/components/Header";
import Navbar from "@/layouts/components/Navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <Header />
      <Navbar />
      {/* Main content */}
      {children}
    </React.Fragment>
  );
}
