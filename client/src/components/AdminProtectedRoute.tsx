import React from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  // Function to get a cookie value by name
  const getCookie = (name: string) => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return cookies ? cookies.split("=")[1] : null;
  };

  // Example usage:
  const adminToken = getCookie("adminToken");

  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }

  return adminToken ? children : <Navigate to="/admin/login" />;
}

export default AdminProtectedRoute;
