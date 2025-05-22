import {
  Row,
  Col,
  Select,
  Table,
  Badge,
  Input,
  ConfigProvider,
  theme,
  Avatar,
} from "antd";
import { statusOptions } from "@/constants/selectOption";
import { useEffect, useState } from "react";
import { getIssueList, getUserByProjectId } from "@/api/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import helper from "@/helpers";

const { Search } = Input;

export default function Issues() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issueList, setIssueList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [status, setStatus] = useState(null);
  const [assigneeId, setAssigneeId] = useState(null);
  const getRiskColor = (score: number) => {
    if (score >= 15) return "bg-red-500 text-white";
    if (score >= 8) return "bg-yellow-400 text-black";
    if (score >= 4) return "bg-yellow-200 text-black";
    return "bg-green-500 text-white";
  };
  const columns = [
    {
      title: "Mức độ rủi ro",
      render: (_, record) => {
        return (
          <span
            // style={{ background: `${record?.color}` }}
            className={`${getRiskColor(
              record.score
            )} px-2 py-0.25 flex justify-center w-[50px] rounded-full transition cursor-pointer text-white`}
          >
            {record?.score}
          </span>
        );
      },
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
        const targetDate = dayjs(endDate);
        const today = dayjs();
        const isbefore = targetDate.isBefore(today, "day");
        return (
          <div>
            <span className={`flex ${isbefore ? "text-[#f42858]" : ""}`}>
              {dayjs(endDate).format("DD/MM/YYYY")}
              {isbefore ? (
                <svg
                  style={{ width: "18px", height: "18px", fill: "#f42858" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 18 18"
                  className="icon -medium over-due__icon"
                >
                  <path d="M4.9 4C4 2.9 3.5 1.6 4.6.8S5.9 0 5.9 0s-.3 1.2 0 2c.5 1.2-.7 1.4-1 2zm7.7.9c-2-2.3-.8-4.9-.8-4.9C9.4.4 7 3.7 8.3 7c1.2 2.9-1.7 3.2-2.2.3-4.4 5.2-1.3 10.4 3 10.7-.5-.6-2-1.3-1.6-3.2s2.2-.5 3.2-2.2c.6-.9.7-3 .7-3s1.4 3.7.5 5.4c-.7 1.4-1.9 2.5-2.4 3 4.2-.1 6.3-2.7 6.5-5.1.2-2.5-1-5.3-3.4-8z" />
                </svg>
              ) : (
                <></>
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const xx = statusOptions.find((x) => x.value == record.status);
        return (
          <span
            style={{ background: `${xx?.color}` }}
            className={`px-2 py-0.25 flex justify-center w-[120px] rounded-full transition cursor-pointer text-white`}
          >
            {xx?.label}
          </span>
        );
      },
    },
    {
      title: "Người phụ trách",
      render: (endDate: string, record) => {
        return (
          <div className="flex items-center">
            <Avatar
              style={{
                backgroundColor: "#f56a00",
                verticalAlign: "middle",
              }}
              size="small"
              gap={4}
            >
              {helper.getFirstCharaterOfName(record.assignee?.fullName)}
            </Avatar>
            <div className="ml-2">
              <h5 className="text-md">
                <span>{record.assignee?.fullName}</span>
              </h5>
            </div>
          </div>
        );
      },
    },
    {
      title: "Bình luận",
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
          status: status != null ? Number(status) : null,
          assigneeId: assigneeId != null ? Number(assigneeId) : null,
          searchTerm: "",
        });
        if (response.isSuccessded) {
          const data = response.data.list.map((x) => {
            return {
              ...x,
              score: x.likeLiHood * x.conseQuence,
            };
          });
          setIssueList(data);
        } else {
          setIssueList([]);
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
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Table
          columns={columns}
          dataSource={issueList}
          rowKey={"id"}
          scroll={{
            x: 900,
            y: 500,
          }}
          bordered
          onRow={(record: any) => {
            return {
              onClick: () => {
                navigate(`/projects/${projectId}/issues/${record.id}`);
              }, // click row
            };
          }}
        />
      </ConfigProvider>
    </>
  );
}
