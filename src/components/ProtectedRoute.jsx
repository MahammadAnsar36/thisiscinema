import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token"); // ✅ Read token from storage
    const location = useLocation(); // ✅ Get current location

    return token ? <Outlet /> : <Navigate to="/signin" state={{ from: location }} replace />;
};

export default ProtectedRoute;
