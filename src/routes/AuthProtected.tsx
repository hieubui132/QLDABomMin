import React, { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Dùng nếu bạn đang dùng React Router
// import { useAuth } from '../hooks/useAuth'; // hook tùy chỉnh để lấy trạng thái đăng nhập

type AuthProtectedProps = {
  children: ReactNode;
};

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  //   const { isAuthenticated, loading } = useAuth(); // ví dụ: isAuthenticated = true/false, loading = true khi đang fetch trạng thái
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("Token");
  const loading = false;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // hoặc spinner gì đó
  }

  if (!isAuthenticated) {
    return null; // tránh hiển thị nội dung trước khi redirect
  }

  return <>{children}</>;
};

export default AuthProtected;
