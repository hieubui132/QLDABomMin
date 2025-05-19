import { getProjectDetail } from "@/api/apiClient";
import StatusFilter from "@/components/common/StatusFilter";
import type { StatusFilterValue } from "@/interfaces/Components/StatusFilterValue";
import type { ProjectDto } from "@/interfaces/Project/ProjectDto";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Flex,
  Input,
  Radio,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  type TableProps,
} from "antd";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
type TabPosition = "left" | "right" | "top" | "bottom";
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Role",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Thời điểm tham gia",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
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
const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
const ProjectSetting = () => {
  const [form] = Form.useForm();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDto | null>(null);
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
    } catch (ex) {}
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
  const [statusChoice, setStatusChoice] = useState<number>(-1);
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
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    );
  };
  const items = [
    {
      label: `Cài Đặt Chung`,
      key: 1,
      children: <General />,
    },
    {
      label: `Thành viên`,
      key: 2,
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
