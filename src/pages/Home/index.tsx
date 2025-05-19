// import { useParams } from "react-router-dom";
import PercentBar from "@/components/common/PercentBar";
import { Row, Col, Card, Space } from "antd";
// import { statusOptions } from "@/constants/selectOption";

const Home = () => {
  // const { projectId } = useParams();

  return (
    <div className="w-full">
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
