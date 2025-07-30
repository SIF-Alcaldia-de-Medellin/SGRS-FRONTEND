import {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/Auth";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();
    return user.isAuthenticated ? children : <Navigate to="/login" />;
};