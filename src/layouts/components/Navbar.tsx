import React, { useState } from "react";
import {
  HomeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "Home",
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    key: "AddIssue",
    label: <Link to={"/projects/project1/add"}>Add Issue</Link>,
    icon: <PlusOutlined />,
  },
  {
    key: "Issues",
    label: "Issues",
    icon: <UnorderedListOutlined />,
  },
  {
    key: "Files",
    label: "Files",
    icon: <FolderOutlined />,
  },
];

const Navbar: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["Home"]);

  const onClick: MenuProps["onClick"] = (e) => {
    setSelectedKeys([e.key]);
  };

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
