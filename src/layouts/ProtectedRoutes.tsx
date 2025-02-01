import { useAppSelector } from "@/Redux/features/hook";
import { useCurrentToken, useCurrentUser } from "@/Redux/features/auth/authSlice"; // Assuming you have a selector for role
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
interface token {
    email: string;
    role: string;
}
const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
    const token = useAppSelector(useCurrentToken) as token | null;
    const user = useAppSelector(useCurrentUser) as token | null;
    const role = user?.role;  // Get the current user role
    const location = useLocation(); // Get the current location

    // Define the role-based access logic
    const isAdminRoute = location.pathname.startsWith("/admin");
    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate state={{ from: location }} to="/login" />;
    }

    if (isAdminRoute && role !== "admin") {
        // Redirect to a different page if the user is not an admin
        return <Navigate to="/" />;
    }

    return <>{children}</>; // Render protected content if authenticated and authorized
};

export default ProtectedRoutes;
