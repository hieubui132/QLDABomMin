import { Row, Col, Button, Modal, Form, Input } from "antd";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Modal
        open={isModalOpen}
        title="Add Project"
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Project Name is required!",
              },
            ]}
            label="Project Name"
            name="ProjectName"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Project Key"
            name="ProjectKey"
            rules={[
              {
                required: true,
                message: "Project Key is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="text-end">
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal>
      <Row gutter={20}>
        <Col xxl={12} xs={24}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl mb-2">
              <strong>Projects</strong>
            </h2>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Add Project
            </Button>
          </div>
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
        </Col>
        <Col xxl={12} xs={24}>
          <h2 className="text-xl mb-2">
            <strong>Recent Updates</strong>
          </h2>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
