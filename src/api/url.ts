//Đăng nhập
export const url_login = "/api/users/login";

//Lấy danh sách dự án
export const url_getProjectList = "/api/projects/list";

//Lấy chi tiết dự án
export const url_getProjectDetail = "/api/projects/get";

//Thêm issue
export const url_addIssue = "/api/issues/upsert";

//Phongnv

//
export const url_getShareFile = "/api/filedatas/listsharefile/";
export const url_createShareFile = "/api/filedatas/createfolder";
export const url_uploadFile = "/api/filedatas/upload";
export const url_deleteFolder = "/api/filedatas/deletefolder";
export const url_downloadZip = "/api/filedatas/downloadzip";
export const url_getUserByProjectId = "/api/projects/getuserbyprojectid";
export const url_getUserNotExistsInProjectId =
  "api/projects/getusernotexistsinprojectid";

export const url_addUserInProject = "/api/projects/adduserinproject";
export const url_deleteUserInProject = "/api/projects/deleteuserinproject";

export const url_issuelist = "/api/issues/list";
