import {
  Button,
  Form,
  Select,
  Input,
  Row,
  Col,
  DatePicker,
  Upload,
  Badge,
} from "antd";
import { useState, useRef, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import JoditEditor from "jodit-react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { statusOptions } from "@/constants/selectOption";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { addIssue, getUserByProjectId } from "@/api/apiClient";

const { Dragger } = Upload;
const { RangePicker } = DatePicker;
const editorButtons = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "symbols",
  "|",
  "ul",
  "ol",
  "|",
  "link",
  "image",
  "|",
  "eraser",
  "source",
  "|",
  "about",
];

export default function AddIssue() {
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const { projectId } = useParams();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "#",
    accept: "image/*",
    showUploadList: false,
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toast.error("Chỉ được phép tải lên file ảnh!");
      }
      return isImage || Upload.LIST_IGNORE; // Chặn file không hợp lệ
    },
    customRequest({ file, onSuccess }) {
      // Chuyển file thành base64
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = () => {
        const base64String = reader.result as string;

        // Chèn ảnh vào editor
        setContent(
          `${content}<img src="${base64String}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`
        );

        // Gọi onSuccess để hoàn tất quá trình upload
        onSuccess?.(file);
      };
      reader.onerror = (error) => {
        console.error("Error converting image to base64:", error);
        toast.error("Không thể xử lý ảnh. Vui lòng thử lại.");
      };
    },
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Nhập mô tả...",
      buttons: editorButtons,
    }),
    []
  );

  const handleAddIssue = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        issueName: values.Title,
        riskDecriptions: content,
        startDated: dayjs(values.Date[0]).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(values.Date[1]).format("YYYY-MM-DDTHH:mm:ss"),
        status: Number(values.Status),
        likeLiHood: null,
        conseQuence: null,
        lat: 0,
        long: 0,
        assigneeId: values.Assignee,
        projectId: Number(projectId),
      };
      const res: any = await addIssue(formData);
      if (res.isSuccessded) {
        toast.success("Thêm mới rủi ro thành công!");
        form.resetFields();
        setContent("");
      } else {
        toast.error("Thêm mới rủi ro thất bại!");
      }
    } catch (error) {
      console.error("Error adding issue:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <h1 className="text-xl mb-2">
        <strong>Thêm mới rủi ro</strong>
      </h1>
      <Form onFinish={handleAddIssue} form={form}>
        <Form.Item
          name={"Title"}
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>
        <Card className="rounded-sm mb-4 pb-0">
          <CardContent>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              // onChange={(newContent) => {
              //   console.log("Content changed:", newContent);
              // }}
            />
            <Row className="mt-4" gutter={50}>
              <Col xxl={12} xs={24}>
                <Form.Item
                  name={"Status"}
                  initialValue={"0"}
                  label="Trạng thái"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn trạng thái",
                    },
                  ]}
                >
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
                  />
                </Form.Item>
                <Form.Item
                  name={"Assignee"}
                  label="Người phụ trách"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn người phụ trách",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn người phụ trách"
                    options={userList}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xxl={12} xs={24}>
                <Form.Item
                  name={"Date"}
                  label="Thời hạn"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
                    },
                  ]}
                >
                  <RangePicker
                    format={"DD/MM/YYYY"}
                    className="w-full"
                    allowClear
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </CardContent>
        </Card>
        <Form.Item>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo ảnh vào đây để tải ảnh lên
            </p>
            {/* <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p> */}
          </Dragger>
        </Form.Item>
        {/* <Form.Item label="Notify comment to:" layout="vertical">
          <Select mode="multiple" />
        </Form.Item> */}
        <div className="text-end">
          <Button
            type="primary"
            htmlType="submit"
            className="w-50"
            loading={loading}
          >
            Thêm
          </Button>
        </div>
      </Form>
    </>
  );
}
