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
import { useState, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import JoditEditor from "jodit-react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { statusOptions } from "@/constants/selectOption";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { addIssue } from "@/api/apiClient";

const { Dragger } = Upload;

export default function AddIssue() {
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const { projectId } = useParams();

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
    customRequest({ file }) {
      console.log("File upload:", file);
    },
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Nhập mô tả...",
    }),
    []
  );

  const handleAddIssue = async (values: any) => {
    try {
      const formData = {
        issueName: values.Title,
        riskDecriptions: content,
        startDated: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(values.DueDate).format("YYYY-MM-DDTHH:mm:ss"),
        status: Number(values.Status),
        likeLiHood: 1,
        conseQuence: 1,
        lat: 0,
        long: 0,
        assigneeId: 1,
        projectId: projectId,
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
    }
  };

  return (
    <>
      <h1 className="text-xl mb-2">
        <strong>Thêm mới rủi ro</strong>
      </h1>
      <Form onFinish={handleAddIssue} form={form}>
        <Form.Item name={"Title"}>
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
                {/* <Form.Item
                  name={"Category"}
                  label="Danh mục"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Select placeholder="Chọn danh mục" />
                </Form.Item> */}
              </Col>
              <Col xxl={12} xs={24}>
                <Form.Item
                  name={"Assignee"}
                  label="Người được giao"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Select placeholder="Chọn người được giao" />
                </Form.Item>
                <Form.Item
                  name={"DueDate"}
                  label="Ngày hết hạn"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    placeholder="Chọn ngày hết hạn"
                    className="w-full"
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
          <Button type="primary" htmlType="submit" className="w-50">
            Thêm
          </Button>
        </div>
      </Form>
    </>
  );
}
