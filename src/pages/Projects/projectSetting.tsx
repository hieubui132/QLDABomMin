import {
  deleteUserInProject,
  getProjectDetail,
  getUserByProjectId,
} from "@/api/apiClient";
import StatusFilter from "@/components/common/StatusFilter";
import type { StatusFilterValue } from "@/interfaces/Components/StatusFilterValue";
import type { ProjectDto } from "@/interfaces/Project/ProjectDto";
import type { ProjectUserDto } from "@/interfaces/User/ProjectUserDto";
import {
  faUser,
  faUserPlus,
  faUsers,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Flex,
  Input,
  Space,
  Table,
  Tabs,
  Tooltip,
  type TableProps,
} from "antd";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddUserToProjectModal from "./Modal/addUserToProjectModal";
import type { ProjectUserActionDto } from "@/interfaces/Project/ProjectUserActionDto";
import { toast } from "react-toastify";
import { roleOptions } from "@/constants/selectOption";
import UpsertUser from "../User/Modal/UpsertUser";

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

const ProjectSetting = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDto | null>(null);

  useEffect(() => {
    fecthProject();
  }, []);

  const fecthProject = async () => {
    try {
      const result = await getProjectDetail(projectId);
      if (result.isSuccessded && result.data != null) {
        //form.setFieldsValue({ projectName: result.data?.projectName });
        setProject(result.data);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const items = [
    {
      label: `Thành viên`,
      key: `1`,
      children: <Employee projectId={projectId}></Employee>,
    },
    {
      label: `Cài Đặt Chung`,
      key: `2`,
      children: <General />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" tabPosition="left" items={items} />
    </div>
  );
};

const General = () => {
  const [form] = Form.useForm();
  const handleAddIssue = async (values: any) => {
    try {
      console.log("xx", values);
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };
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

const Employee = ({ projectId }) => {
  const [statusChoice, setStatusChoice] = useState<number>(-1);
  const [inputSeach, setInputSearch] = useState("");
  const [isModalChoiceUserOpen, setIsModalChoiceUserOpen] = useState(false);
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUserDto[]>([]);
  const showModalChoiceUser = () => {
    setIsModalChoiceUserOpen(true);
  };
  const columns: TableProps<ProjectUserDto>["columns"] = [
    {
      title: "Tên",
      key: "name",
      render: (_, record: ProjectUserDto) => (
        <span>{record.user?.fullName}</span>
      ),
    },
    {
      title: "Email",
      key: "age",
      render: (_, record: ProjectUserDto) => <span>{record.user?.email}</span>,
    },
    {
      title: "Role",
      render: (_, record: ProjectUserDto) => (
        <span>{roleOptions.find((x) => x.value == record.role)?.label}</span>
      ),
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
              onClick={() => fetchDeleteUser(record.userId)}
              icon={faX}
              style={{ color: "red", cursor: "pointer" }}
            ></FontAwesomeIcon>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const fetchDeleteUser = async (id: number) => {
    try {
      const userCondition: ProjectUserActionDto = {
        projectId: Number(projectId),
        userIds: [id],
      };
      const result = await deleteUserInProject(userCondition);
      if (result.isSuccessded) {
        toast.success("Xóa người dùng khỏi dự án thành công!");
        fetchUserInProject();
      } else {
        toast.error(result.errors?.join(" "));
      }
    } catch (ex) {
      console.log(ex);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleOkModalChoiceUser = () => {
    setIsModalChoiceUserOpen(false);
    fetchUserInProject();
  };

  const handleCancelModalChoiceUser = () => {
    setIsModalChoiceUserOpen(false);
  };

  useEffect(() => {
    fetchUserInProject();
  }, [statusChoice]);

  const search = () => {
    fetchUserInProject();
  };
  const fetchUserInProject = async () => {
    try {
      setLoading(true);
      const result = await getUserByProjectId(
        Number(projectId),
        statusChoice === -1 ? undefined : statusChoice,
        inputSeach
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

  return (
    <Flex vertical gap="middle">
      <h1 className="text-xl mb-2">
        <strong>Thành viên</strong>
      </h1>
      <Flex align="center" gap="small">
        <strong className=" mr-[5px]">Quyền:</strong>
        <StatusFilter
          value={statusChoice}
          status={enumx}
          setValue={setStatusChoice}
        ></StatusFilter>
      </Flex>
      <Flex gap="small" justify="space-between" className="mb-2">
        <Flex gap="small">
          <Input
            placeholder="Nhập tên hoặc email"
            value={inputSeach}
            onChange={(e) => setInputSearch(e.target.value)}
          ></Input>
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={search}
          />
        </Flex>
        <Flex gap="small">
          <Button
            icon={<FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>}
            onClick={showModalChoiceUser}
          >
            Thêm Thành Viên
          </Button>
          <Button
            icon={<FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>}
            onClick={() => setIsModalAddUser(true)}
          >
            Thêm Người Dùng Mới
          </Button>
        </Flex>
      </Flex>
      <Table<ProjectUserDto>
        loading={loading}
        columns={columns}
        dataSource={projectUsers}
      />
      <UpsertUser
        isOpen={isModalAddUser}
        setOpen={setIsModalAddUser}
      ></UpsertUser>

      <AddUserToProjectModal
        isModalChoiceUserOpen={isModalChoiceUserOpen}
        handleOkModalChoiceUser={handleOkModalChoiceUser}
        handleCancelModalChoiceUser={handleCancelModalChoiceUser}
      ></AddUserToProjectModal>
    </Flex>
  );
};

export default ProjectSetting;
