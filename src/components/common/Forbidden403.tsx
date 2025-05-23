import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";

export default function Forbidden403() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md text-center animate-fade-in">
        <div className="text-red-500 text-6xl mb-4">
          <FrownOutlined />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-2">403</h1>
        <h2 className="text-xl text-gray-600 mb-6">
          Bạn không có quyền truy cập trang này.
        </h2>
      </div>
    </div>
  );
}
