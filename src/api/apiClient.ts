import { ApiClient } from "./config";
import * as url from "./url";

const apiInstance = new ApiClient();

export const login = (data: any) => apiInstance.post(url.url_login, data);

export const getProjectList = (data: any) =>
  apiInstance.post(url.url_getProjectList, data);

export const getProjectDetail = (id: any) =>
  apiInstance.get(`${url.url_getProjectDetail}/${id}`);

export const addIssue = (data: any) => apiInstance.post(url.url_addIssue, data);
