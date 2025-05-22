type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

interface OptionType {
  label: string;
  value: string | number;
  badgeStatus?: BadgeStatus;
  color?: string;
}

export const statusOptions: OptionType[] = [
  {
    badgeStatus: "warning",
    label: "Mở",
    value: "0",
    color: "#ed8077",
  },
  {
    badgeStatus: "processing",
    label: "Đang thực hiện",
    value: "1",
    color: "#4488c5",
  },
  {
    badgeStatus: "success",
    label: "Hoàn thành",
    value: "2",
    color: "#5eb5a6",
  },
  {
    badgeStatus: "error",
    label: "Đóng",
    value: "3",
    color: "#a1af2f",
  },
];

export const ConseQuenceType: OptionType[] = [
  {
    label: "Rất thấp",
    value: 1,
  },
  {
    label: "Thấp",
    value: 2,
  },
  {
    label: "Trung bình",
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

export const LikeLiHoodType: OptionType[] = [
  {
    label: "Rất nhỏ",
    value: 1,
  },
  {
    label: "Nhỏ",
    value: 2,
  },
  {
    label: "Trung bình",
    value: 3,
  },
  {
    label: "Nghiêm trọng",
    value: 4,
  },
  {
    label: "Thảm họa",
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
