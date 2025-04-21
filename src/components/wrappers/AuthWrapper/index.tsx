import Loading from "@/components/partials/Loading";
import { useAuth } from "@/components/providers/AuthProvider";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
