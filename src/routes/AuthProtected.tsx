import React, { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Dùng nếu bạn đang dùng React Router

type AuthProtectedProps = {
  children: ReactNode;
};

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authUser");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // tránh hiển thị nội dung trước khi redirect
  }

  return <>{children}</>;
};

export default AuthProtected;
