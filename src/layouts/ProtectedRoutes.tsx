import { useAppSelector } from "@/Redux/features/hook";
import { useCurrentToken } from "@/Redux/features/auth/authSlice";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
    const token = useAppSelector(useCurrentToken);
    const location = useLocation(); // Get the current location

    if (!token) {
        // Redirect to login and pass the current location in state
        return <Navigate state={{ from: location }} to="/login" />;
    }

    return <>{children}</>; // Render protected content if authenticated
};

export default ProtectedRoutes;
