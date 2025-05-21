// import { useParams } from "react-router-dom";
import PercentBar from "@/components/common/PercentBar";
import { Row, Col, Card, Space } from "antd";
import RiskMatrix from "./RiskMatrix";
import MapRisk from "./MapRisk";
import type { IssueCondition } from "@/interfaces/Issue/Condition/IssueCondition";
import { useParams } from "react-router-dom";
import { getIssueListP } from "@/api/apiClient";
import { useEffect, useState } from "react";
import type { IssueDto } from "@/interfaces/Issue/IssueDto";
// import { statusOptions } from "@/constants/selectOption";

const Home = () => {
  // const { projectId } = useParams();
  const { projectId } = useParams();
  const [issues, setIssues] = useState<IssueDto[]>([]);
  const fetchIssueList = async () => {
    try {
      const condition: IssueCondition = {
        projectId: Number(projectId),
        pageSize: 10000,
        pageNumber: 1,
      };
      const result = await getIssueListP(condition);
      if (result.isSuccessded) {
        const res = result.data?.list.map((x) => {
          if (x.likeLiHood == undefined || x.conseQuence == undefined) {
            x.score = undefined;
          } else {
            x.score = x.likeLiHood * x.conseQuence;
          }
          return x;
        });
        setIssues(res ?? []);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    fetchIssueList();
  }, [projectId]);

  return (
    <div className="">
      <div>{/* <RiskMatrix></RiskMatrix> */}</div>
      <Row gutter={16} className="mb-10">
        <Col span={12}>
          <h2 className="text-xl font-bold mb-4">Ma trận Rủi ro</h2>
          <Card>
            <div className=" overflow-x-auto h-full w-full">
              <RiskMatrix issues={issues}></RiskMatrix>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <h2 className="text-xl font-bold mb-4">Khu vực rủi ro</h2>
          <Card>
            <div className=" overflow-x-auto w-full">
              <MapRisk issues={issues}></MapRisk>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xxl={14}>
          <h2 className="text-lg mb-2">
            <strong>Cập nhật</strong>
          </h2>
          <Space direction="vertical" size={16} className="w-full">
            <Card title="Thu May. 15, 2025">HieuBC added a new</Card>
            <Card title="Thu May. 15, 2025">HieuBC added a new</Card>
          </Space>
        </Col>
        <Col xxl={10}>
          <h2 className="text-lg mb-2">
            <strong>Status</strong>
          </h2>
          <Card>
            <PercentBar
              percents={[
                {
                  percent: 20,
                  color: "red",
                },
                {
                  percent: 30,
                  color: "blue",
                },
                {
                  percent: 30,
                  color: "green",
                },
                {
                  percent: 20,
                  color: "orange",
                },
              ]}
            />
            <div className="text-end">
              <span>0% Closed</span>
            </div>
          </Card>
          <div className="mt-4">
            <h2 className="text-lg mb-2">
              <strong>Category</strong>
            </h2>
            <Card>
              <PercentBar
                percents={[
                  {
                    percent: 20,
                    color: "red",
                  },
                  {
                    percent: 30,
                    color: "blue",
                  },
                  {
                    percent: 30,
                    color: "green",
                  },
                  {
                    percent: 20,
                    color: "orange",
                  },
                ]}
              />
              <div className="text-end">
                <span>0% Closed</span>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
