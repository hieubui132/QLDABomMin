import { Badge, Tag } from "antd";

export default function NotifyItem() {
  return (
    <div className="flex items-center p-4 border-b border-[#eaeaea] hover:bg-[#f5f5f5] cursor-pointer">
      <div className="mr-4">
        <Badge dot></Badge>
      </div>
      <div className="px-4">
        <p className="max-w-[200px] break-words mb-1">
          The project risk status has been updated
        </p>
        <Tag>Priority: Medium</Tag>
      </div>
      <span>2025-05-12 07:30:50</span>
    </div>
  );
}
