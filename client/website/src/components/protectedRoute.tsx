import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { Spinner } from "@/components/ui/spinner";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col">
        <div className="grow flex flex-col items-center justify-center gap-6">
          <Spinner className="size-8" />
          <p className="text-center text-gray-500">
            We don't help you to write, but to finish your novel.
          </p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
