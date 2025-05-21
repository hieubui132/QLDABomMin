// import { useParams } from "react-router-dom";

import { addUserInProject, getUserNotExistsInProjectId } from "@/api/apiClient";
import { roleOptions } from "@/constants/selectOption";
import type { ProjectDto } from "@/interfaces/Project/ProjectDto";
import type { ProjectUserDto } from "@/interfaces/User/ProjectUserDto";
import type { User } from "@/interfaces/User/User";
import {
  Modal,
  Select,
  Table,
  type TableColumnsType,
  type TableProps,
} from "antd";
import type { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
interface AddUserToProjectModalProps {
  isModalChoiceUserOpen: boolean;
  handleOkModalChoiceUser: () => void;
  handleCancelModalChoiceUser: () => void;
}

const AddUserToProjectModal = ({
  isModalChoiceUserOpen,
  handleOkModalChoiceUser,
  handleCancelModalChoiceUser,
}: AddUserToProjectModalProps) => {
  // const { projectId } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowSelected, setRowSelected] = useState<User[]>([]);
  const { projectId } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: TableColumnsType<User> = [
    {
      title: "Tên",
      render: (_, record: User) => <span>{record.fullName}</span>,
    },
    {
      title: "Email",
      render: (_, record: User) => <span>{record.email}</span>,
    },
    {
      title: "Phân quyền",
      render: (_, record: User) => {
        return (
          <Select
            disabled={!rowSelected.some((x) => x.id == record.id)}
            defaultValue="2"
            onChange={(value) => {
              setUsers((prev) => {
                const find = prev.find((x) => x.id == record.id);
                if (find) {
                  find.role = Number(value);
                }
                return prev;
              });
            }}
            style={{ width: 180 }}
            options={roleOptions}
          />
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getUserNotExistsInProjectId(Number(projectId));
      if (result.isSuccessded) {
        const d = result.data?.map((x) => {
          return {
            ...x,
            role: 2,
          };
        });
        setUsers(d ?? []);
      }
      setLoading(false);
    } catch (ex) {
      setLoading(false);
      console.log(ex);
    }
  };

  const fetchAddData = async () => {
    try {
      setLoading(true);
      const condition: ProjectUserDto[] = rowSelected.map((x) => ({
        projectId: Number(projectId),
        role: x.role,
        userId: x.id,
        joinDate: new Date(),
        id: 0,
      }));
      const result = await addUserInProject(condition);
      if (result.isSuccessded) {
        handleOkModalChoiceUser();
      }
      setLoading(false);
    } catch (ex) {
      setLoading(false);
      console.log(ex);
    }
  };

  const rowSelection: TableProps<User>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
      setRowSelected(selectedRows);
    },
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Modal
      width={800}
      title="Thêm mới thành viên"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalChoiceUserOpen}
      onOk={fetchAddData}
      onCancel={handleCancelModalChoiceUser}
    >
      <Table<User>
        loading={loading}
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
      />
    </Modal>
  );
};

export default AddUserToProjectModal;
