import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Card as AntdCard,
  Avatar,
  Tag,
  Space,
  DatePicker,
  Select,
} from "antd";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { addProject, getProjectList, getUsers } from "@/api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Map from "@/components/common/Map";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [listProject, setListProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

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
    setLoading(true);
    try {
      const res: any = await addProject({
        projectName: values.ProjectName,
        lat: Number(values.Latitude),
        long: Number(values.Longitude),
        startDate: values.TimeLimit[0].format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        endDate: values.TimeLimit[1].format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        status: 0,
        managerId: values.Manager,
      });
      if (res.isSuccessded) {
        toast.success("Thêm dự án thành công");
        setOpen(false);
        form.resetFields();
      } else {
        toast.error("Thêm dự án thất bại");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Thêm dự án thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res: any = await getUsers({
          orderBy: "",
          pageNumber: 1,
          pageSize: 999,
          searchTerm: "",
          role: null,
        });
        if (res.isSuccessded) {
          setUserList(
            res?.data?.list.map((item: any) => ({
              label: item.fullName,
              value: item.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserList();
  }, []);

  useEffect(() => {
    if (form && open) {
      form.setFieldsValue({
        Latitude: coordinates.lat,
        Longitude: coordinates.lng,
      });
    }
  }, [coordinates, form, open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80%] h-[80%]">
          <DialogHeader>
            <DialogTitle>Thêm dự án</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Row gutter={40}>
            <Col xxl={8}>
              <Form layout="vertical" form={form} onFinish={handleAddProject}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Tên dự án là bắt buộc!",
                    },
                  ]}
                  label="Tên dự án"
                  name="ProjectName"
                >
                  <Input placeholder="Nhập tên dự án" />
                </Form.Item>
                <Form.Item label="Tọa độ" style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="Latitude"
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder="Kinh độ" />
                  </Form.Item>
                  <Form.Item
                    name="Longitude"
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                      marginLeft: "16px",
                    }}
                  >
                    <Input placeholder="Vĩ độ" />
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thời hạn!",
                    },
                  ]}
                  label="Thời hạn"
                  name="TimeLimit"
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder={["Bắt đầu", "Kết thúc"]}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Người quản lý là bắt buộc!",
                    },
                  ]}
                  label="Người quản lý"
                  name="Manager"
                >
                  <Select
                    placeholder="Chọn người quản lý"
                    options={userList}
                    allowClear
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                  />
                </Form.Item>
                <div className="text-end">
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Thêm
                  </Button>
                </div>
              </Form>
            </Col>
            <Col xxl={16}>
              <Map setCoordinates={setCoordinates} />
            </Col>
          </Row>
          <DialogFooter>
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </DialogContent>
        <Row gutter={20}>
          <Col xxl={12} xs={24}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl mb-2">
                <strong>Dự án</strong>
              </h2>
              <DialogTrigger asChild>
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setOpen(true)}
                >
                  Thêm dự án
                </Button>
              </DialogTrigger>
            </div>
            {listProject?.length > 0 &&
              listProject.map((item: any, index) => {
                return (
                  <Card
                    className="hover:bg-[#4096FF] cursor-pointer hover:text-white transition-all duration-200 mb-2"
                    onClick={() => navigate(`/projects/${item.id}`)}
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
            <Space
              direction="vertical"
              size={16}
              className="w-full overflow-y-auto"
            >
              <AntdCard title="Tue May. 20, 2025" className="shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar
                      style={{
                        backgroundColor: "#f56a00",
                        verticalAlign: "middle",
                      }}
                      size="large"
                      gap={4}
                    >
                      H
                    </Avatar>
                    <div className="ml-2">
                      <span>
                        <strong>
                          HieuBC <Tag color="#4CAF93">updated</Tag>the issue
                        </strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs">a day ago</span>
                </div>
                <div className="ml-[50px]">
                  <p>RPHBOMTNHTHIBINH-2 test</p>
                  <p>[ Resolution: Invalid ]</p>
                </div>
              </AntdCard>
              <AntdCard title="Tue May. 20, 2025" className="shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar
                      style={{
                        backgroundColor: "#f56a00",
                        verticalAlign: "middle",
                      }}
                      size="large"
                      gap={4}
                    >
                      H
                    </Avatar>
                    <div className="ml-2">
                      <span>
                        <strong>
                          HieuBC <Tag color="#4CAF93">updated</Tag>the issue
                        </strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs">a day ago</span>
                </div>
                <div className="ml-[50px]">
                  <p>RPHBOMTNHTHIBINH-2 test</p>
                  <p>[ Resolution: Invalid ]</p>
                </div>
              </AntdCard>
            </Space>
          </Col>
        </Row>
      </Dialog>
    </>
  );
};

export default Dashboard;
