//Đăng nhập
export const url_login = "/api/users/login";

//Lấy danh sách dự án
export const url_getProjectList = "/api/projects/list";

//Lấy chi tiết dự án
export const url_getProjectDetail = "/api/projects/get";

//Thêm issue
export const url_addIssue = "/api/issues/upsert";

//Lấy danh sách issue
export const url_getIssueList = "/api/issues/list";

//Lấy chi tiết issue
export const url_getIssueDetail = "/api/issues/get";

//Thêm bình luận
export const url_addComment = "/api/issues/comment";

//Lấy danh sách bình luận
export const url_getCommentList = "/api/issues/listcomment";

//Thêm mới dự án
export const url_addProject = "/api/projects/upsert";

//Thêm mới người dùng
export const url_addUser = "/api/users/upsert";

//Lấy danh sách người dùng
export const url_getUserList = "/api/users/list";

//Phongnv
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
export const url_getUser = "/api/users/get";

export const url_getProjectUser = "/api/projects/get";
