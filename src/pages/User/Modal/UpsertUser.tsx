import { Button, Form, Input, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";
interface UpsertUserProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpsertUser = ({ isOpen, setOpen }: UpsertUserProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handle = async (values: any) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      setOpen(false);
      console.log("xx", values);
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  const validateMessages = {
    required: "Vui lòng nhập ${label}!",
    types: {
      email: "${label} Vui lòng nhập email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <div>
      <Modal
        width={500}
        title="Thêm mới người dùng"
        closable={{ "aria-label": "Custom Close Button" }}
        onCancel={() => setOpen(false)}
        open={isOpen}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handle}
          form={form}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", required: true }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Họ Tên"
            rules={[{ required: true }]}
          >
            <Input placeholder="Họ Tên" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="rePassword"
            label="Nhập lại mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
            dependencies={["password"]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div className="flex items-center justify-center ">
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm mới
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UpsertUser;
