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
import type { User } from "@/interfaces/User/User";
import type { ProjectUserActionDto } from "@/interfaces/Project/ProjectUserActionDto";
import type { IssueCondition } from "@/interfaces/Issue/Condition/IssueCondition";
import type { IssueDto } from "@/interfaces/Issue/IssueDto";
import type { PageList } from "@/interfaces/Paging/PageList";

const apiInstance = new ApiClient();

export const login = (data: any) => apiInstance.post(url.url_login, data);

export const getProjectList = (data: any) =>
  apiInstance.post(url.url_getProjectList, data);

export const getProjectDetail = (id: any) =>
  apiInstance.get<ApiResult<ProjectDto>>(`${url.url_getProjectDetail}/${id}`);

export const addIssue = (data: any) => apiInstance.post(url.url_addIssue, data);

export const getIssueList = (data: any) =>
  apiInstance.post(url.url_getIssueList, data);

export const getIssueDetail = (id: any) =>
  apiInstance.get(`${url.url_getIssueDetail}?issueId=${id}`);

export const addComment = (data: any) =>
  apiInstance.post(url.url_addComment, data);

export const getCommentList = (data: any) =>
  apiInstance.post(`${url.url_getCommentList}/${data.issueId}`, data);

export const addProject = (data: any) =>
  apiInstance.post(url.url_addProject, data);

export const addUser = (data: any) => apiInstance.post(url.url_addUser, data);

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

export const getUserByProjectId = (
  projectId: number,
  role?: number,
  searchTerm?: string
) => {
  let urlGet = url.url_getUserByProjectId + `?projectId=${projectId}`;
  if (role) {
    urlGet = urlGet + `&role=${role}`;
  }
  if (searchTerm) {
    urlGet = urlGet + `&searchTerm=${searchTerm}`;
  }
  return apiInstance.get<ApiResult<ProjectUserDto[]>>(urlGet);
};

export const getUserNotExistsInProjectId = (projectId: number) =>
  apiInstance.get<ApiResult<User[]>>(
    url.url_getUserNotExistsInProjectId + `?projectId=${projectId}`
  );
export const addUserInProject = (data: ProjectUserDto[]) =>
  apiInstance.post<ApiResult<ProjectUserDto[]>>(url.url_addUserInProject, data);

export const deleteUserInProject = (data: ProjectUserActionDto) =>
  apiInstance.post<ApiResult<boolean>>(url.url_deleteUserInProject, data);

export const getIssueListP = (data: IssueCondition) =>
  apiInstance.post<ApiResult<PageList<IssueDto>>>(url.url_issuelist, data);
