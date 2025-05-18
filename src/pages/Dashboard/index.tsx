import { Row, Col, Button, Modal, Form, Input } from "antd";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProjectList } from "@/api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listProject, setListProject] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res: any = await getProjectList({
          orderBy: "",
          pageNumber: 1,
          pageSize: 999,
        });
        if (res.isSuccessded) {
          setListProject(res?.data?.list);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  const handleAddProject = async (values: any) => {
    try {
      console.log("values", values);
    } catch (error) {}
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        title="Thêm dự án"
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" form={form} onFinish={handleAddProject}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Project Name is required!",
              },
            ]}
            label="Tên dự án"
            name="ProjectName"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ID dự án"
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
              Thêm
            </Button>
          </div>
        </Form>
      </Modal>
      <Row gutter={20}>
        <Col xxl={12} xs={24}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl mb-2">
              <strong>Dự án</strong>
            </h2>
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              Thêm dự án
            </Button>
          </div>
          {listProject?.length > 0 &&
            listProject.map((item: any, index) => {
              return (
                <Card
                  className="hover:bg-[#4096FF] cursor-pointer hover:text-white transition-all duration-200 mb-2"
                  onClick={() => navigate("/projects/project1")}
                  key={index}
                >
                  <CardContent>{item.projectName}</CardContent>
                </Card>
              );
            })}
        </Col>
        <Col xxl={12} xs={24}>
          <h2 className="text-xl mb-2">
            <strong>Cập nhật</strong>
          </h2>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
