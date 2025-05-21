export enum EIssueStatus {
  OPEN = 0, // Mở
  INPROGRESS = 1, // Đang thực hiện
  RESOLVED = 2, // Hoàn thành
  CLOSED = 3, // Đóng
}

export enum ELikeLiHood {
  INSIGNIFICANT = 1,
  MINOR = 2,
  MODERATE = 3,
  MAJOR = 4,
  CATASTROPHIC = 5,
}

export enum EConseQuence {
  RARE = 1,
  UNLIKELY = 2,
  POSSIBLE = 3,
  LIKELY = 4,
  ALMOSTCERTAIN = 5,
}
