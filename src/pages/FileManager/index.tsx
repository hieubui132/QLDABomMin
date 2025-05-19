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
import type {
  TableColumnsType,
  TableProps,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import {
  createShareFile,
  deleteShareFile,
  downloadZip,
  getShareFileList,
  uploadFile,
} from "@/api/apiClient";
import type { ApiResult } from "@/interfaces/ApiResult/ApiResult";
import type { ShareFile } from "@/interfaces/FileData/FileData";
import { NavLink } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import type { CreateFolderDto } from "@/interfaces/FileData/CreateFolderDto";
import type { FileDataUploadDto } from "@/interfaces/FileData/FileDataUploadDto";
import type { PickFolderDto } from "@/interfaces/FileData/PickFolderDto";
import { toast } from "react-toastify";
import { formatSize } from "@/util/common";

const { Dragger } = Upload;
export default function FileManager() {
  const [isShowAddFolder, setIsShowAddFolder] = useState<boolean>(false);
  const [isShowAddFile, setIsShowAddFile] = useState<boolean>(false);

  const [isShowTool, setIsShowTool] = useState<boolean>(true);

  const [rowSelected, setRowSelected] = useState<ShareFile[]>([]);

  const [selectionType] = useState<"checkbox" | "radio">("checkbox");
  const [form] = Form.useForm();
  const [datas, setDatas] = useState<ShareFile[]>([]);
  const [searchParams] = useSearchParams();
  const searchPath = searchParams.get("search") ?? "";
  const { projectId } = useParams();
  const [folderName, setFolderName] = useState<string>("");

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onProgress, onSuccess, onError } = options;
    try {
      const form = new FormData();
      let folderP: string = "";
      if (searchPath == "/") {
        folderP = "/";
      } else if (searchPath == "") {
        folderP = "/";
      } else {
        folderP = searchPath;
      }

      const fileDataUploadDto: FileDataUploadDto = {
        ProjectId: Number(projectId),
        Type: 1,
        PathDir: folderP,
      };
      console.log(fileDataUploadDto);
      form.append("files", file as Blob);
      form.append("fileDataUploadDto", JSON.stringify(fileDataUploadDto));
      const result = await uploadFile(form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            console.log(event.total);
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress?.({ percent });
          }
        },
      });
      if (result.isSuccessded) {
        onSuccess?.("Tải File Lên Thành Công!");
      }
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    //action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    customRequest: customRequest,
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      const allDone =
        info.fileList.length > 0 &&
        info.fileList.every((f) =>
          ["done", "error"].includes(f.status as string)
        );
      if (allDone) {
        fetchShareFile(searchPath == "" ? "/" : searchPath);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

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
            {data.isFolder ? (
              <NavLink
                to={`/projects/${projectId}/file?search=${data.pathDir}`}
                style={{ cursor: "pointer" }}
              >
                {_text}
              </NavLink>
            ) : (
              <span>{_text}</span>
            )}
          </Flex>
        );
      },
    },
    {
      title: "Kích Thước",
      //dataIndex: "size",
      render: (_text: string, data: ShareFile) => {
        if (data.file != null && !data.isFolder) {
          return <span>{formatSize(Number(data.file.fileSize))}</span>;
        }
        return <span></span>;
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

  useEffect(() => {
    fetchShareFile(searchPath == "" ? "/" : searchPath);
  }, [searchPath]);

  const onAddFile = () => {
    setIsShowAddFile((value) => !value);
    setIsShowAddFolder(false);
  };

  const onDeleteFolder = async () => {
    try {
      const condition: PickFolderDto = {
        ids: rowSelected.map((x) => x.id),
        projectId: Number(projectId),
      };
      const result = await deleteShareFile(condition);
      if (result.isSuccessded) {
        toast.success("Xóa thành công!");
        fetchShareFile(searchPath == "" ? "/" : searchPath);
      } else {
        toast.error(result.errors?.join(" "));
      }
      console.log(rowSelected);
    } catch (ex) {
      console.log(ex);
      toast.error("Đã xảy ra lỗi.");
    }
  };
  const onDownload = async () => {
    try {
      const condition: PickFolderDto = {
        ids: rowSelected.map((x) => x.id),
        projectId: Number(projectId),
      };
      const result = await downloadZip(condition, { responseType: "blob" });
      const url = URL.createObjectURL(result);
      const a = document.createElement("a");
      a.href = url;
      a.download = "export.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (ex) {
      console.log(ex);
      toast.error("Đã xảy ra lỗi.");
    }
  };

  const onAddFolder = () => {
    setIsShowAddFile(false);
    setIsShowAddFolder((value) => !value);
  };
  const rowSelection: TableProps<ShareFile>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ShareFile[]) => {
      setRowSelected(selectedRows);
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
      let folderP: string = "";
      if (searchPath == "/") {
        folderP = "/" + folderName;
      } else if (searchPath == "") {
        folderP = "/" + folderName;
      } else {
        folderP = searchPath + "/" + folderName;
      }
      const search: CreateFolderDto = {
        folderName: folderP,
        //projectId: Number(projectId),
        projectId: Number(projectId),
      };
      const result: ApiResult<boolean> = await createShareFile(search);
      if (result.isSuccessded) {
        toast.success("Thêm thư mục thành công!");
        fetchShareFile(searchPath == "" ? "/" : searchPath);
        setIsShowAddFolder(false);
      } else {
        toast.error(result.errors?.join(" "));
      }
    } catch (ex) {
      console.log(ex);
      toast.error("Đã xảy ra lỗi.");
    }
  };

  const fetchShareFile = async (path: string) => {
    try {
      const result: ApiResult<ShareFile[]> = await getShareFileList(
        path,
        Number(projectId)
      );
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
                Đóng
              </Button>
            </Flex>
          </Flex>
        )}
        <Table<ShareFile>
          pagination={false}
          rowSelection={{ type: selectionType, ...rowSelection }}
          columns={columns}
          rowKey="id"
          dataSource={datas}
          footer={() => {
            return (
              <Flex gap="small" justify="end">
                <Button danger onClick={onDeleteFolder} disabled={isShowTool}>
                  Xóa
                </Button>
                <Button
                  disabled={isShowTool}
                  type="dashed"
                  icon={<DownloadOutlined />}
                  onClick={onDownload}
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
