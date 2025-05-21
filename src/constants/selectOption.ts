type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

interface OptionType {
  label: string;
  value: string | number;
  badgeStatus?: BadgeStatus;
}

export const statusOptions: OptionType[] = [
  {
    badgeStatus: "warning",
    label: "Mở",
    value: "0",
  },
  {
    badgeStatus: "processing",
    label: "Đang thực hiện",
    value: "1",
  },
  {
    badgeStatus: "success",
    label: "Hoàn thành",
    value: "2",
  },
  {
    badgeStatus: "error",
    label: "Đóng",
    value: "3",
  },
];

export const riskLevel: OptionType[] = [
  {
    label: "Hiếm",
    value: 1,
  },
  {
    label: "Thấp",
    value: 2,
  },
  {
    label: "Vừa",
    value: 3,
  },
  {
    label: "Cao",
    value: 4,
  },
  {
    label: "Rất cao",
    value: 5,
  },
];

export const roleOptions: OptionType[] = [
  {
    badgeStatus: "warning",
    label: "Admin",
    value: "0",
  },
  {
    badgeStatus: "processing",
    label: "Quản lý dự án",
    value: "1",
  },
  {
    badgeStatus: "success",
    label: "Nhân viên thi công",
    value: "2",
  },
];
