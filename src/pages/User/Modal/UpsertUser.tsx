import { Button, Form, Input, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { addUser } from "@/api/apiClient";
import { toast } from "react-toastify";

interface UpsertUserProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpsertUser = ({ isOpen, setOpen }: UpsertUserProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handle = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await addUser({
        email: values.email,
        passWord: values.password,
        fullName: values.fullname,
      });
      if (res.isSuccessded) {
        toast.success("Thêm mới người dùng thành công");
        form.resetFields();
        setOpen(false);
      } else {
        toast.error("Thêm mới người dùng thất bại");
      }
    } catch (error) {
      console.error("Error adding issue:", error);
    } finally {
      setLoading(false);
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
          <div className="text-end">
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
