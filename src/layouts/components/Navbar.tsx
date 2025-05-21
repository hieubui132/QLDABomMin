import { useState, useEffect } from "react";
import {
  HomeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  FolderOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

interface NavbarProps {
  projectId: string | undefined;
}

const Navbar = ({ projectId }: NavbarProps) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    setItems([
      {
        key: `/projects/${projectId}`,
        label: <Link to={`/projects/${projectId}`}>Trang chủ</Link>,
        icon: <HomeOutlined />,
      },
      {
        key: `/projects/${projectId}/add-issue`,
        label: <Link to={`/projects/${projectId}/add-issue`}>Thêm rủi ro</Link>,
        icon: <PlusOutlined />,
      },
      {
        key: `/projects/${projectId}/issues`,
        label: (
          <Link to={`/projects/${projectId}/issues`}>Danh sách rủi ro</Link>
        ),
        icon: <UnorderedListOutlined />,
      },
      {
        key: `/projects/${projectId}/file`,
        label: <Link to={`/projects/${projectId}/file`}>Files</Link>,
        icon: <FolderOutlined />,
      },
      {
        key: `/projects/${projectId}/projectsetting`,
        label: (
          <Link to={`/projects/${projectId}/projectsetting`}>
            Cài đặt dự án
          </Link>
        ),
        icon: <SettingOutlined />,
      },
    ]);
    setSelectedKeys([`/projects/${projectId}`]);
  }, [projectId]);

  const onClick: MenuProps["onClick"] = (e) => {
    setSelectedKeys([e.key]);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  return (
    <div className="fixed top-[50px] left-0 h-full">
      <Menu
        onClick={onClick}
        style={{ width: 260, height: "100%" }}
        selectedKeys={selectedKeys}
        mode="inline"
        items={items}
        theme="dark"
      />
    </div>
  );
};

export default Navbar;
