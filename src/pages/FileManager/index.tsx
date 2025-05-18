import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Space,
  Table,
  Upload,
} from "antd";
import {
  DownloadOutlined,
  FileDoneOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { TableColumnsType, TableProps, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { createShareFile, getShareFileList } from "@/api/apiClient";
import type { ApiResult } from "@/interfaces/ApiResult/ApiResult";
import type { ShareFile } from "@/interfaces/FileData/FileData";
import { NavLink } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import type { CreateFolderDto } from "@/interfaces/FileData/CreateFolderDto";

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

export default function FileManager() {
  const [isShowAddFolder, setIsShowAddFolder] = useState<boolean>(false);
  const [isShowAddFile, setIsShowAddFile] = useState<boolean>(false);

  const [isShowTool, setIsShowTool] = useState<boolean>(true);
  const [selectionType] = useState<"checkbox" | "radio">("checkbox");
  const [form] = Form.useForm();
  const [datas, setDatas] = useState<ShareFile[]>([]);
  const [searchParams] = useSearchParams();
  const searchPath = searchParams.get("search") ?? "";
  const { projectId } = useParams();
  const [folderName, setFolderName] = useState<string>("");

  const columns: TableColumnsType<ShareFile> = [
    {
      title: "Tên File",
      dataIndex: "name",
      render: (_text: string, data: ShareFile) => {
        return (
          <Flex gap="small">
            {data.isFolder ? (
              <FontAwesomeIcon icon={faFolderOpen} size="lg" color="#FFDE48" />
            ) : (
              <FileDoneOutlined style={{ fontSize: "20px" }} />
            )}
            <NavLink
              to={`/projects/${projectId}/file?search=${data.pathDir}`}
              onClick={() => clickShareFile(data)}
              style={{ cursor: "pointer" }}
            >
              {_text}
            </NavLink>
          </Flex>
        );
      },
    },
    {
      title: "Kích Thước",
      //dataIndex: "size",
      render: (_text: string, data: ShareFile) => {
        return <span>_text</span>;
      },
    },
    {
      title: "Người Tạo",
      //dataIndex: "createBy",
      render: (_text: string, data: ShareFile) => {
        return <span>{data.createUser?.fullName ?? ""}</span>;
      },
    },
  ];

  const clickShareFile = (data: ShareFile) => {
    // if (data.isFolder && data.id != 0) {
    //   navigate(data.pathDir.replace(/^\/+/, ""), { relative: "path" });
    // }
    // if (data.id == 0) {
    //   navigate(data.pathDir.replace(/^\/+/, ""), { relative: "path" });
    // }
  };

  useEffect(() => {
    fetchShareFile(searchPath == "" ? "/" : searchPath);
  }, [searchPath]);

  const onAddFile = () => {
    setIsShowAddFile((value) => !value);
    setIsShowAddFolder(false);
  };

  const onAddFolder = () => {
    setIsShowAddFile(false);
    setIsShowAddFolder((value) => !value);
  };
  const rowSelection: TableProps<ShareFile>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ShareFile[]) => {
      if (selectedRows.length > 0) {
        setIsShowTool(false);
      } else {
        setIsShowTool(true);
      }
    },
    // getCheckboxProps: (record: ShareFile) => ({
    //   disabled: record.fileName === "Disabled User", // Column configuration not to be checked
    //   name: record.fileName,
    // }),
  };
  const fetchCreateShareFile = async () => {
    try {
      if (projectId == undefined) return;
      const search: CreateFolderDto = {
        folderName: folderName,
        projectId: Number(projectId),
      };
      const result: ApiResult<boolean> = await createShareFile(search);
      if (result.isSuccessded) {
        fetchShareFile(searchPath == "" ? "/" : searchPath);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const fetchShareFile = async (path: string) => {
    try {
      const result: ApiResult<ShareFile[]> = await getShareFileList(path);
      if (result.isSuccessded) {
        let d: ShareFile[] = result.data ?? [];
        if (
          searchPath !== "/" &&
          searchPath !== "" &&
          !d.some((f) => f.id === 0)
        ) {
          const parts = searchPath.split("/").filter(Boolean);
          parts.pop();
          const empty: ShareFile = {
            id: 0,
            name: "..",
            pathDir: "/" + parts.join("/"),
            isFolder: true,
            currentPathDir: searchPath,
          };
          d = [empty, ...d];
        } else {
          d = d.filter((f) => f.id !== 0);
        }
        setDatas(d);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const getTextLabel = () => {
    let text: string = "File";
    if (searchPath) {
      text = text + searchPath;
    }
    return text;
  };

  return (
    <>
      <Flex vertical gap="middle">
        <Flex justify="space-between" gap="small">
          <h1 className="text-xl mb-2">
            <strong>{getTextLabel()}</strong>
          </h1>
          <Flex gap="small">
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              onClick={onAddFolder}
            >
              Tạo Thư Mục
            </Button>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              onClick={onAddFile}
            >
              Thêm File
            </Button>
          </Flex>
        </Flex>
        {isShowAddFolder && (
          <Card style={{ width: "100%" }}>
            <Space>
              <span>Thêm Thư Mục</span>
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nhập tên thư mục"
                style={{ width: 300 }}
              />
              <Button type="primary" onClick={() => fetchCreateShareFile()}>
                Thêm
              </Button>
              <Button danger onClick={() => setIsShowAddFolder(false)}>
                Hủy
              </Button>
            </Space>
          </Card>
        )}
        {isShowAddFile && (
          <Flex vertical gap="small">
            <Form onFinish={() => {}} form={form}>
              <Form.Item>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Dragger>
              </Form.Item>
            </Form>
            <Flex justify="center">
              <Button danger onClick={onAddFile}>
                Hủy
              </Button>
            </Flex>
          </Flex>
        )}
        <Table<ShareFile>
          rowSelection={{ type: selectionType, ...rowSelection }}
          columns={columns}
          dataSource={datas}
          footer={() => {
            return (
              <Flex gap="small" justify="end">
                <Button danger onClick={onAddFile} disabled={isShowTool}>
                  Xóa
                </Button>
                <Button
                  disabled={isShowTool}
                  type="dashed"
                  icon={<DownloadOutlined />}
                  onClick={onAddFile}
                >
                  Tải Về
                </Button>
              </Flex>
            );
          }}
        />
        <></>
      </Flex>
    </>
  );
}
