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
      <main
        style={{
          marginTop: "50px",
          marginLeft: "260px",
          padding: "20px",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </React.Fragment>
  );
}
