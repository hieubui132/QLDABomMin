import React from "react";
import {
  HomeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "Home",
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    key: "AddIssue",
    label: "Add Issue",
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
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <div className="fixed top-[50px] left-0 h-full">
      <Menu
        onClick={onClick}
        style={{ width: 260, height: "100%" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
        theme="dark"
      />
    </div>
  );
};

export default Navbar;
