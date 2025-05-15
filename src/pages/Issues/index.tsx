import { Row, Col, Select, Table, Badge } from "antd";
import { statusOptions } from "@/constants/selectOption";

export default function Issues() {
  const columns = [
    {
      title: "Issue Type",
      dataIndex: "IssueType",
    },
    {
      title: "Key",
      dataIndex: "Key",
    },
    {
      title: "Subject",
      dataIndex: "Subject",
    },
    {
      title: "Assignee",
      dataIndex: "Assignee",
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "Created",
      dataIndex: "Created",
    },
    {
      title: "Due Date",
      dataIndex: "DueDate",
    },
    {
      title: "Updated",
      dataIndex: "Updated",
    },
    {
      title: "Registered by",
      dataIndex: "RegisteredBy",
    },
    {
      title: "Attachment",
      dataIndex: "Attachment",
    },
  ];
  return (
    <>
      <Row gutter={20} className="mb-4">
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
          />
        </Col>
        <Col xxl={6}>
          <Select className="w-full" />
        </Col>
        <Col xxl={6}>
          <Select className="w-full" />
        </Col>
        <Col xxl={6}>
          <Select className="w-full" />
        </Col>
      </Row>
      <Table columns={columns} />
    </>
  );
}
