type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

interface OptionType {
  label: string;
  value: string;
  badgeStatus: BadgeStatus;
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
