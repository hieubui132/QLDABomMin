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
      <main
        style={{
          marginTop: "50px",
          padding: "20px",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </React.Fragment>
  );
}
