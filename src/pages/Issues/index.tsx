import { Row, Col, Select, Table, Badge, Input } from "antd";
import { statusOptions } from "@/constants/selectOption";
import { useEffect, useState } from "react";
import { getIssueList, getUserByProjectId } from "@/api/apiClient";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Search } = Input;

export default function Issues() {
  const { projectId } = useParams();
  const [issueList, setIssueList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [status, setStatus] = useState(null);
  const [assigneeId, setAssigneeId] = useState(null);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "issueName",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDated",
      render: (startDated: string) => {
        return dayjs(startDated).format("DD/MM/YYYY");
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      render: (endDate: string) => {
        return dayjs(endDate).format("DD/MM/YYYY");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Người phụ trách",
      dataIndex: "assignee",
    },
    {
      title: "Mô tả",
      dataIndex: "riskDecriptions",
      render: (text: string) => {
        return text.length > 50 ? text.slice(0, 50) + "..." : text;
      },
    },
  ];

  useEffect(() => {
    const fetchIssueList = async () => {
      try {
        const response: any = await getIssueList({
          orderBy: "",
          pageNumber: 1,
          pageSize: 999,
          projectId: Number(projectId),
          status: status,
          assigneeId: assigneeId,
          searchTerm: "",
        });
        if (response.isSuccessded) {
          setIssueList(response.data.list);
        }
      } catch (error) {
        console.error("Error fetching issue list:", error);
      }
    };
    fetchIssueList();
  }, [status, assigneeId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res: any = await getUserByProjectId(Number(projectId));
        if (res.isSuccessded) {
          const users = res.data.map((item: any) => ({
            label: item.user.fullName,
            value: item.user.id,
          }));
          setUserList(users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Row gutter={20} className="mb-4">
        <Col xxl={6}>
          <Search className="w-full" placeholder="Tìm kiếm" />
        </Col>
        <Col xxl={6}>
          <Select
            options={statusOptions.map((item) => {
              return {
                label: (
                  <>
                    <Badge status={item.badgeStatus} />
                    <span className="ml-2">{item.label}</span>
                  </>
                ),
                value: item.value,
              };
            })}
            className="w-full"
            placeholder="Trạng thái"
            allowClear
            onChange={(value) => {
              setStatus(value);
            }}
          />
        </Col>
        <Col xxl={6}>
          <Select
            className="w-full"
            placeholder="Người phụ trách"
            allowClear
            options={userList}
            onChange={(value) => {
              setAssigneeId(value);
            }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={issueList}
        rowKey={"id"}
        scroll={{
          x: 900,
          y: 500,
        }}
        bordered
      />
    </>
  );
}
