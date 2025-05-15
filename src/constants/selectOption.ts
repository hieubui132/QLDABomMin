type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

interface OptionType {
  label: string;
  value: string;
  badgeStatus: BadgeStatus;
}

export const statusOptions: OptionType[] = [
  {
    badgeStatus: "warning",
    label: "Open",
    value: "Open",
  },
  {
    badgeStatus: "processing",
    label: "In Progress",
    value: "InProgress",
  },
  {
    badgeStatus: "success",
    label: "Resolved",
    value: "Resolved",
  },
  {
    badgeStatus: "error",
    label: "Closed",
    value: "Closed",
  },
];
