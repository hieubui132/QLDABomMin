import { getProjectDetail, getUserByProjectId } from "@/api/apiClient";
import StatusFilter from "@/components/common/StatusFilter";
import type { StatusFilterValue } from "@/interfaces/Components/StatusFilterValue";
import { getRoleName } from "@/interfaces/Enum/RoleType";
import type { ProjectDto } from "@/interfaces/Project/ProjectDto";
import type { ProjectUserDto } from "@/interfaces/User/ProjectUserDto";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Flex,
  Input,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  type TableProps,
} from "antd";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const columns: TableProps<ProjectUserDto>["columns"] = [
  {
    title: "Tên",
    key: "name",
    render: (_, record: ProjectUserDto) => <span>{record.user.fullName}</span>,
  },
  {
    title: "Email",
    key: "age",
    render: (_, record: ProjectUserDto) => <span>{record.user.email}</span>,
  },
  {
    title: "Role",
    key: "address",
    render: (_, record: ProjectUserDto) => <span>{record.user.role}</span>,
  },
  {
    title: "Thời điểm tham gia",
    key: "tags",
    render: (_, record: ProjectUserDto) => (
      <>
        <span>{dayjs(record.joinDate).format("HH:mm:ss DD/MM/YYYY")}</span>
      </>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record: ProjectUserDto) => (
      <Space size="middle">
        <Tooltip placement="topLeft" title="Xóa thành viên khỏi dự án">
          <FontAwesomeIcon
            icon={faX}
            style={{ color: "red", cursor: "pointer" }}
          ></FontAwesomeIcon>
        </Tooltip>
      </Space>
    ),
  },
];

const ProjectSetting = () => {
  const [form] = Form.useForm();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [projectUsers, setProjectUsers] = useState<ProjectUserDto[]>([]);
  const [statusChoice, setStatusChoice] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const handleAddIssue = async (values: any) => {
    try {
      console.log("xx", values);
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  useEffect(() => {
    fecthProject();
  }, []);

  const fecthProject = async () => {
    try {
      const result = await getProjectDetail(projectId);
      if (result.isSuccessded && result.data != null) {
        form.setFieldsValue({ projectName: result.data?.projectName });
        setProject(result.data);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    fetchUserInProject();
  }, [statusChoice]);

  const fetchUserInProject = async () => {
    try {
      setLoading(true);
      const result = await getUserByProjectId(
        Number(projectId),
        statusChoice === -1 ? undefined : statusChoice
      );
      if (result.isSuccessded) {
        console.log(result.data);
        setProjectUsers(result.data ?? []);
      }
      setLoading(false);
    } catch (ex) {
      console.log(ex);
      setLoading(false);
    }
  };

  const General = () => {
    return (
      <div>
        <h1 className="text-xl mb-2">
          <strong>Cài đặt chung</strong>
        </h1>
        <Form onFinish={handleAddIssue} form={form}>
          <Form.Item name="projectName">
            <label>Tên dự án</label>
            <Input placeholder="Tên dự án" />
          </Form.Item>
          <div className="">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  const enumx: StatusFilterValue[] = [
    {
      name: "Tất cả",
      value: -1,
    },
    {
      name: "Admin",
      value: 1,
    },
    {
      name: "Nhân viên dự án",
      value: 2,
    },
    {
      name: "Nhân viên Thực hiện",
      value: 3,
    },
  ];

  const Employee = () => {
    return (
      <div>
        <h1 className="text-xl mb-2">
          <strong>Thành viên</strong>
        </h1>
        <Flex gap="middle" vertical>
          <Flex align="center" gap="small">
            <strong className=" mr-[5px]">Quyền:</strong>
            <StatusFilter
              value={statusChoice}
              status={enumx}
              setValue={setStatusChoice}
            ></StatusFilter>
          </Flex>
        </Flex>
        <Flex gap="small" justify="space-between">
          <Flex gap="small">
            <Input></Input>
            <Button></Button>
          </Flex>
          <Flex gap="small">
            <Button>Thêm Thành Viên</Button>
            <Button>Thêm Người Dùng Mới</Button>
          </Flex>
        </Flex>
        <Table<ProjectUserDto>
          loading={loading}
          columns={columns}
          dataSource={projectUsers}
        />
      </div>
    );
  };
  const items = [
    {
      label: `Cài Đặt Chung`,
      key: `1`,
      children: <General />,
    },
    {
      label: `Thành viên`,
      key: `2`,
      children: <Employee></Employee>,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" tabPosition="left" items={items} />
    </div>
  );
};

export default ProjectSetting;
