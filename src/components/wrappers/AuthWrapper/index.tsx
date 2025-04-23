import Loading from "@/components/partials/Loading";
import { useAuth } from "@/components/providers/AuthProvider";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface PrivateRouteProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Navigate
        to="/authentication/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
