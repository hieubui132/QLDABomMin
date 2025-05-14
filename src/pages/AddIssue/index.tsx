import {
  Button,
  Form,
  Select,
  Input,
  Row,
  Col,
  DatePicker,
  message,
  Upload,
  Badge,
} from "antd";
import { useState, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import JoditEditor from "jodit-react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

export default function AddIssue() {
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
    }),
    []
  );

  return (
    <>
      <h1 className="text-xl mb-2">
        <strong>Add Issue</strong>
      </h1>
      <Form onFinish={() => {}} form={form}>
        <Form.Item name={"issueType"} initialValue={"Task"}>
          <Select
            options={[
              { label: "Task", value: "Task" },
              { label: "Bug", value: "Bug" },
              { label: "Request", value: "Request" },
              { label: "Other", value: "Other" },
            ]}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item>
          <Input placeholder="Subject" />
        </Form.Item>
        <Card className="rounded-sm mb-4 pb-0">
          <CardContent>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={(newContent) => {
                console.log("Content changed:", newContent);
              }}
            />
            <Row className="mt-4" gutter={50}>
              <Col xxl={12} xs={24}>
                <Form.Item
                  name={"Status"}
                  initialValue={"Open"}
                  label="Status"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Select
                    options={[
                      {
                        label: (
                          <>
                            <Badge status="warning" />
                            <span className="ml-2">Open</span>
                          </>
                        ),
                        value: "Open",
                      },
                      {
                        label: (
                          <>
                            <Badge status="processing" />
                            <span className="ml-2">In Progress</span>
                          </>
                        ),
                        value: "In Progress",
                      },
                      {
                        label: (
                          <>
                            <Badge status="success" />
                            <span className="ml-2">Resolved</span>
                          </>
                        ),
                        value: "Resolved",
                      },
                      {
                        label: (
                          <>
                            <Badge status="error" />
                            <span className="ml-2">Closed</span>
                          </>
                        ),
                        value: "Closed",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={"Category"}
                  label="Category"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Select />
                </Form.Item>
              </Col>
              <Col xxl={12} xs={24}>
                <Form.Item
                  name={"Assignee"}
                  label="Assignee"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <Select />
                </Form.Item>
                <Form.Item
                  name={"DueDate"}
                  label="Due Date"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                >
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    placeholder="Select date"
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
              Click or drag file to this area to upload
            </p>
            {/* <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p> */}
          </Dragger>
        </Form.Item>
        <Form.Item label="Notify:">
          <Select mode="multiple" />
        </Form.Item>
        <div className="text-end">
          <Button type="primary" htmlType="submit" className="w-50">
            Add
          </Button>
        </div>
      </Form>
    </>
  );
}
