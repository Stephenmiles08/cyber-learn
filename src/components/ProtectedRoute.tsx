import { Navigate } from "react-router-dom";

type Role = 'superadmin' | 'instructor' | 'student';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') as Role | null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has permission
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // Redirect based on actual role
      if (role === 'superadmin') {
        return <Navigate to="/superadmin/dashboard" replace />;
      } else if (role === 'instructor') {
        return <Navigate to="/instructor/dashboard" replace />;
      } else {
        return <Navigate to="/student/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};
