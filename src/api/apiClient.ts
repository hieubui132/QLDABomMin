import { ApiClient } from "./config";
import * as url from "./url";

const apiInstance = new ApiClient();

export const login = (data: any) => apiInstance.post(url.url_login, data);

export const getProjectList = (data: any) =>
  apiInstance.post(url.url_getProjectList, data);

export const getProjectDetail = (id: any) =>
  apiInstance.get(`${url.url_getProjectDetail}/${id}`);

export const addIssue = (data: any) => apiInstance.post(url.url_addIssue, data);

// PhongNV
export const getShareFileList = (path: string) =>
  apiInstance.get<ApiResult<ShareFile[]>>(
    url.url_getShareFile + `?path=${encodeURIComponent(path)}`
  );

export const createShareFile = (data: CreateFolderDto) =>
  apiInstance.post<ApiResult<boolean>>(url.url_createShareFile, data);
