import React from "react";
import Header from "@/layouts/components/Header";
import Navbar from "@/layouts/components/Navbar";
import { useParams } from "react-router-dom";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId } = useParams();

  return (
    <React.Fragment>
      <div className="bg-[#f0f2f5] min-h-screen">
        <Header />
        <Navbar />
        <main className="ml-[260px] pt-[50px]">
          <div className="h-[50px] flex items-center px-[20px] border-b-1 bg-white">
            <h2>
              <strong>{projectId}</strong>
            </h2>
          </div>
          <div className="p-[20px]">{children}</div>
        </main>
      </div>
    </React.Fragment>
  );
}
