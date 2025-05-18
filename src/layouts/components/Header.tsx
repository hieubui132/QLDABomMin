import logo from "@/assets/images/Logo-Tong-Cong-Ty-319.png";
import { useState, useEffect } from "react";
import {
  MailOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Badge, Space, Dropdown } from "antd";
import NotifyItem from "@/components/common/NotifyItem";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    label: <Link to={"/dashboard"}>Dashboard</Link>,
    key: "/dashboard",
    icon: <MailOutlined />,
  },
  {
    label: "Dự án",
    key: "Projects",
    icon: <SettingOutlined />,
    children: [
      {
        label: <Link to={"/projects/project1"}>project 1</Link>,
        key: "/projects/project1",
      },
      {
        label: <Link to={"/projects/project2"}>project 2</Link>,
        key: "/projects/project2",
      },
    ],
  },
];

const profileItems: MenuProps["items"] = [
  {
    key: "1",
    disabled: true,
    label: (
      <div>
        <p>
          <strong>My Account</strong>
        </p>
        <p>abc@gmail.com</p>
      </div>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "4",
    label: "Cài đặt",
    icon: <SettingOutlined />,
  },
  {
    key: "Signout",
    label: "Đăng xuất",
    icon: <LogoutOutlined />,
  },
];

export default function Header() {
  const [selectedKeys, setSelectedKeys] = useState(["mail"]);
  const location = useLocation();
  const navigate = useNavigate();

  const onMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKeys([e.key]);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const handleProfileClick: MenuProps["onClick"] = (e) => {
    if (e.key === "Signout") {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#edf4f0] shadow-md z-900 h-[50px]">
      <div className="flex items-center h-full px-1 py-1">
        <div className="w-[260px] h-full">
          <img src={logo} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex-1">
            <Menu
              onClick={onMenuClick}
              selectedKeys={selectedKeys}
              mode="horizontal"
              items={menuItems}
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
            />
          </div>
          <div className="px-[32px]">
            <Space size={12}>
              <Dropdown
                popupRender={() => (
                  <div className="bg-white rounded-lg shadow-lg p-2">
                    <NotifyItem />
                    <NotifyItem />
                    <div className="text-center pt-3">
                      <Button
                        variant={"outline"}
                        className="text-[#377dff] hover:bg-[#377dff] hover:text-white border-[#377dff]"
                      >
                        Xem tất cả thông báo
                      </Button>
                    </div>
                  </div>
                )}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#e0e0e0] transition-all duration-200">
                  <Badge dot>
                    <BellOutlined style={{ fontSize: 20 }} />
                  </Badge>
                </div>
              </Dropdown>
              <Dropdown
                menu={{ items: profileItems, onClick: handleProfileClick }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#e0e0e0] transition-all duration-200">
                  <Badge dot offset={[0, 20]} color="green">
                    <UserOutlined style={{ fontSize: 20 }} />
                  </Badge>
                </div>
              </Dropdown>
            </Space>
          </div>
        </div>
      </div>
    </header>
  );
}
