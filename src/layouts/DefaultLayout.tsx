import React from "react";
import Header from "@/layouts/components/Header";
import Navbar from "@/layouts/components/Navbar";
import { useParams } from "react-router-dom";
// import { Button } from "antd";
import { useEffect, useState } from "react";
import { getProjectDetail } from "@/api/apiClient";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response: any = await getProjectDetail(projectId);
        if (response.isSuccessded) {
          setProjectDetail(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [projectId]);

  return (
    <React.Fragment>
      <div className="bg-[#f0f2f5] min-h-screen">
        <Header />
        <Navbar projectId={projectId} />
        <main className="ml-[260px] pt-[50px]">
          <div className="h-[50px] flex justify-between items-center px-[20px] border-b-1 bg-white">
            <h2>
              <strong>{projectDetail?.projectName}</strong>
            </h2>
            {/* <div>
              <Button
                type="primary"
                icon={<i className="fa-solid fa-plus"></i>}
              >
                Thêm thành viên
              </Button>
            </div> */}
          </div>
          <div className="p-[20px]">{children}</div>
        </main>
      </div>
    </React.Fragment>
  );
}
