import type { ApiResult } from "@/interfaces/ApiResult/ApiResult";
import { ApiClient } from "./config";
import * as url from "./url";
import type { ShareFile } from "@/interfaces/FileData/FileData";
import type { CreateFolderDto } from "@/interfaces/FileData/CreateFolderDto";
import type { FileDataDto } from "@/interfaces/FileData/FileDataDto";

import { type AxiosRequestConfig } from "axios";
import type { PickFolderDto } from "@/interfaces/FileData/PickFolderDto";
import type { ProjectDto } from "@/interfaces/Project/ProjectDto";
import type { ProjectUserDto } from "@/interfaces/User/ProjectUserDto";

const apiInstance = new ApiClient();

export const login = (data: any) => apiInstance.post(url.url_login, data);

export const getProjectList = (data: any) =>
  apiInstance.post(url.url_getProjectList, data);

export const getProjectDetail = (id: any) =>
  apiInstance.get<ApiResult<ProjectDto>>(`${url.url_getProjectDetail}/${id}`);

export const addIssue = (data: any) => apiInstance.post(url.url_addIssue, data);

export const getIssueList = (data: any) =>
  apiInstance.post(url.url_getIssueList, data);

// PhongNV
export const getShareFileList = (path: string, projectId: number) =>
  apiInstance.get<ApiResult<ShareFile[]>>(
    url.url_getShareFile +
      `?path=${encodeURIComponent(path)}` +
      `&projectId=${projectId}`
  );

export const createShareFile = (data: CreateFolderDto) =>
  apiInstance.post<ApiResult<boolean>>(url.url_createShareFile, data);

export const uploadFile = (data: FormData, config?: AxiosRequestConfig) =>
  apiInstance.post<ApiResult<FileDataDto>>(url.url_uploadFile, data, config);

export const deleteShareFile = (data: PickFolderDto) =>
  apiInstance.post<ApiResult<boolean>>(url.url_deleteFolder, data);

export const downloadZip = (data: PickFolderDto, config?: AxiosRequestConfig) =>
  apiInstance.post<any>(url.url_downloadZip, data, config);

export const getUserByProjectId = (projectId: number, role?: number) => {
  let urlGet = url.url_getUserByProjectId + `?projectId=${projectId}`;
  if (role) {
    urlGet = urlGet + `&role=${role}`;
  }
  return apiInstance.get<ApiResult<ProjectUserDto[]>>(urlGet);
};
