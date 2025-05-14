import { Row, Col } from "antd";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <Row gutter={20}>
      <Col xxl={12}>
        <h2 className="text-xl mb-2">
          <strong>Projects</strong>
        </h2>
        <div>
          <Card
            className="hover:bg-[#4caf93] cursor-pointer hover:text-white transition-all duration-200 mb-2"
            onClick={() => navigate("/projects/project1")}
          >
            <CardContent>Project1</CardContent>
          </Card>
          <Card
            className="hover:bg-[#4caf93] cursor-pointer hover:text-white transition-all duration-200"
            onClick={() => navigate("/projects/project2")}
          >
            <CardContent>Project2</CardContent>
          </Card>
        </div>
      </Col>
      <Col xxl={12}>
        <h2 className="text-xl mb-2">
          <strong>Recent Updates</strong>
        </h2>
      </Col>
    </Row>
  );
};

export default Dashboard;
