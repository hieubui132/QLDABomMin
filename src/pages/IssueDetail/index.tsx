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
  Space,
  Avatar,
  Modal,
} from "antd";
import { useState, useRef, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import JoditEditor from "jodit-react";
import {
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { statusOptions, riskLevel } from "@/constants/selectOption";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.locale("vi"); // thiết lập ngôn ngữ là tiếng Việt
dayjs.extend(localizedFormat);
import { useParams } from "react-router-dom";
import * as callApi from "@/api/apiClient";
import parse from "html-react-parser";
import helper from "@/helpers";

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

export default function IssueDetail() {
  const editor = useRef(null);
  const commentEditor = useRef(null);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentContent2, setCommentContent2] = useState("");
  const { projectId, issueId } = useParams();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [open, setOpen] = useState(false);

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
        !open
          ? setContent(
              `${content}<img src="${base64String}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`
            )
          : setCommentContent2(
              `${commentContent2}<img src="${base64String}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`
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
      readonly: !editEnabled, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "",
      buttons: editorButtons,
    }),
    [editEnabled]
  );

  const handleUpdateIssue = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        id: Number(issueId),
        issueName: values.Title,
        riskDecriptions: content,
        startDated: dayjs(values.Date[0]).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(values.Date[1]).format("YYYY-MM-DDTHH:mm:ss"),
        status: Number(values.Status),
        likeLiHood: values.LikeLiHood || null,
        conseQuence: values.ConseQuence || null,
        lat: 0,
        long: 0,
        assigneeId: values.Assignee,
        projectId: Number(projectId),
      };
      const [res, res2]: [any, any] = await Promise.all([
        callApi.addIssue(formData),
        callApi.addComment({
          issueId: Number(issueId),
          content: commentContent,
          issueDto: {
            id: Number(issueId),
            riskDecriptions: content,
            startDated: dayjs(values.Date[0]).format("YYYY-MM-DDTHH:mm:ss"),
            endDate: dayjs(values.Date[1]).format("YYYY-MM-DDTHH:mm:ss"),
            status: Number(values.Status),
            assigneeId: values.Assignee,
            likeLiHood: values.LikeLiHood || null,
            conseQuence: values.ConseQuence || null,
          },
        }),
      ]);
      if (res.isSuccessded && res2.isSuccessded) {
        toast.success("Cập nhật rủi ro thành công!");
        fetchIssueDetail();
      } else {
        toast.error("Cập nhật rủi ro thất bại!");
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
        const res: any = await callApi.getUserByProjectId(Number(projectId));
        if (res.isSuccessded) {
          const users = res.data.map((item: any) => ({
            label: item.user.fullName,
            value: Number(item.user.id),
          }));
          setUserList(users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [projectId]);

  useEffect(() => {
    if (form) {
      fetchIssueDetail();
    }
  }, [issueId, form]);

  const fetchListComment = async () => {
    try {
      const res: any = await callApi.getCommentList({
        orderBy: "",
        pageNumber: 1,
        pageSize: 999,
        issueId: Number(issueId),
      });
      if (res.isSuccessded) {
        // Xử lý danh sách bình luận ở đây
        setCommentList(res.data.list);
      } else {
        setCommentList([]);
      }
    } catch (error) {
      console.error("Error fetching comment list:", error);
    }
  };

  useEffect(() => {
    fetchListComment();
  }, [issueId]);

  const fetchIssueDetail = async () => {
    try {
      const res: any = await callApi.getIssueDetail(Number(issueId));
      if (res.isSuccessded) {
        form.setFieldsValue({
          Title: res.data.issueName,
          Status: String(res.data.status),
          Assignee: res.data.assigneeId,
          Date: [dayjs(res.data.startDated), dayjs(res.data.endDate)],
          LikeLiHood: res.data.likeLiHood,
          ConseQuence: res.data.conseQuence,
        });
        setContent(res.data.riskDecriptions);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCancel = () => {
    setEditEnabled(false);
    fetchIssueDetail();
  };

  const handlePostComment = async (values: any) => {
    try {
      const res: any = await callApi.addComment({
        issueId: Number(issueId),
        content: commentContent2,
        issueDto: {
          id: Number(issueId),
          riskDecriptions: content,
          startDated: dayjs(values.Date[0]).format("YYYY-MM-DDTHH:mm:ss"),
          endDate: dayjs(values.Date[1]).format("YYYY-MM-DDTHH:mm:ss"),
          status: Number(values.Status),
          assigneeId: values.Assignee,
          likeLiHood: values.LikeLiHood || null,
          conseQuence: values.ConseQuence || null,
        },
      });
      if (res.isSuccessded) {
        toast.success("Thêm bình luận thành công!");
        setOpen(false);
        form2.resetFields();
        setCommentContent2("");
        fetchListComment();
      } else {
        toast.error("Thêm bình luận thất bại!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Thêm bình luận thất bại!");
    }
  };

  return (
    <>
      <Modal
        title="Thêm bình luận"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={"70%"}
        footer={null}
      >
        <Form layout="vertical" form={form2} onFinish={handlePostComment}>
          <Row className="mt-4" gutter={30}>
            <Col xxl={2}>
              <div className="h-full flex items-center justify-center">
                <Upload {...props}>
                  <Button icon={<PaperClipOutlined />}></Button>
                </Upload>
              </div>
            </Col>
            <Col xxl={16}>
              <JoditEditor
                value={commentContent2}
                onBlur={(newContent) => setCommentContent2(newContent)}
                config={{
                  readonly: false,
                  placeholder: "Nhập bình luận...",
                  height: 405,
                }}
              />
            </Col>
            <Col xxl={6}>
              <Form.Item name={"Status"} label="Trạng thái">
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
                  placeholder="Chọn trạng thái"
                />
              </Form.Item>
              <Form.Item name={"Assignee"} label="Người phụ trách">
                <Select
                  placeholder="Chọn người phụ trách"
                  options={userList}
                  allowClear
                />
              </Form.Item>
              <Form.Item name={"Date"} label="Thời hạn">
                <RangePicker
                  format={"DD/MM/YYYY"}
                  className="w-full"
                  allowClear
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  allowEmpty={[true, true]}
                />
              </Form.Item>
              <Form.Item name={"LikeLiHood"} label="Tác động">
                <Select
                  placeholder="Chọn mức độ tác động"
                  options={riskLevel}
                  allowClear
                />
              </Form.Item>
              <Form.Item name={"ConseQuence"} label="Khả năng">
                <Select
                  placeholder="Chọn khả năng"
                  options={riskLevel}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="text-end">
            <Space>
              <Button>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl mb-2">
          <strong>Chi tiết rủi ro</strong>
        </h1>
        <Button icon={<EditOutlined />} onClick={() => setEditEnabled(true)}>
          Chỉnh sửa
        </Button>
      </div>
      <Form onFinish={handleUpdateIssue} form={form}>
        <Form.Item
          name={"Title"}
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Tiêu đề" disabled={!editEnabled} />
        </Form.Item>
        <Card className="rounded-sm mb-4 pb-0">
          <CardContent>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
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
                    disabled={!editEnabled}
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
                    disabled={!editEnabled}
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
                    allowEmpty={[true, true]}
                    disabled={!editEnabled}
                  />
                </Form.Item>
                <Form.Item
                  name={"LikeLiHood"}
                  label="Tác động"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                >
                  <Select
                    placeholder="Chọn mức độ tác động"
                    options={riskLevel}
                    allowClear
                    disabled={!editEnabled}
                  />
                </Form.Item>
                <Form.Item
                  name={"ConseQuence"}
                  label="Khả năng"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 10 }}
                >
                  <Select
                    placeholder="Chọn khả năng"
                    options={riskLevel}
                    allowClear
                    disabled={!editEnabled}
                  />
                </Form.Item>
              </Col>
            </Row>
          </CardContent>
        </Card>
        {editEnabled && (
          <>
            <Form.Item>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Nhấp hoặc kéo ảnh vào đây để tải ảnh lên
                </p>
              </Dragger>
            </Form.Item>
            <div className="mb-2">
              <p className="text-lg font-semibold mb-2">Bình luận</p>
              <JoditEditor
                ref={commentEditor}
                value={commentContent}
                tabIndex={2} // tabIndex of textarea
                onBlur={(newContent) => setCommentContent(newContent)}
                config={{
                  readonly: false,
                  placeholder: "Nhập bình luận...",
                  buttons: editorButtons,
                }}
              />
            </div>
            <div className="text-end">
              <Space>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-50"
                  loading={loading}
                >
                  Lưu chỉnh sửa
                </Button>
              </Space>
            </div>
          </>
        )}
      </Form>
      {!editEnabled && (
        <Card className="rounded-sm">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold mb-2">
                Danh sách bình luận
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
              >
                Thêm bình luận
              </Button>
            </div>
            {/* Render danh sách bình luận ở đây */}
            {commentList.length > 0 &&
              commentList.map((item: any, index) => {
                return (
                  <div
                    key={index}
                    className="pb-2 pt-2 border-b border-gray-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle",
                          }}
                          size="large"
                          gap={4}
                        >
                          {helper.getFirstCharaterOfName(
                            item.createUser.fullName
                          )}
                        </Avatar>
                        <div className="ml-3">
                          <h5 className="text-md">
                            <strong>{item.createUser.fullName}</strong>
                          </h5>
                          <span className="text-sm text-gray-500">
                            {dayjs(item.lastModifiedDate).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )}
                          </span>
                        </div>
                      </div>
                      <Button icon={<EditOutlined />}></Button>
                    </div>
                    <div className="html-container ml-[52px]">
                      {parse(item.content)}
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}
    </>
  );
}
