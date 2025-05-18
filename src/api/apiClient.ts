import type { ApiResult } from "@/interfaces/ApiResult/ApiResult";
import { ApiClient } from "./config";
import * as url from "./url";
import type { ShareFile } from "@/interfaces/FileData/FileData";
import type { CreateFolderDto } from "@/interfaces/FileData/CreateFolderDto";

const apiInstance = new ApiClient();

export const login = (data: any) => apiInstance.post(url.url_login, data);

export const getProjectList = (data: any) =>
  apiInstance.post(url.url_getProjectList, data);

// PhongNV
export const getShareFileList = (path: string) =>
  apiInstance.get<ApiResult<ShareFile[]>>(
    url.url_getShareFile + `?path=${encodeURIComponent(path)}`
  );

export const createShareFile = (data: CreateFolderDto) =>
  apiInstance.post<ApiResult<boolean>>(url.url_createShareFile, data);
