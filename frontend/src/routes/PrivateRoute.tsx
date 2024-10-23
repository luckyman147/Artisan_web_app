import { Navigate } from "react-router-dom";
import { setAccessToken } from "../apis/axiosConfig";
import { RootState } from "../stores/store";
import { useAppSelector } from "../stores/storeHooks";

const userRole = (state: RootState) => state.user.userInfos;

// PrivateRoute for artisan users
function PrivateRoute({ children }: any) {
  const lsUser = useAppSelector(userRole);

  // Set access token if user exists
  if (lsUser) {
    setAccessToken(lsUser.token);
  }

  // Check if the user exists and has the role "artisan"
  if (!lsUser || lsUser.role !== "artisan") {
    return <Navigate to={"/login"} />;
  }

  // If the user has the right role, render the children
  return children;
}

// PrivateAdminRoute for admin users
function PrivateAdminRoute({ children }: any) {
  const lsUser = useAppSelector(userRole);

  // Set access token if user exists
  if (lsUser) {
    setAccessToken(lsUser.token);
  }

  // Check if the user exists and has the role "Admin"
  if (!lsUser || lsUser.role !== "Admin") {
    return <Navigate to={"/login"} />;
  }

  // If the user has the right role, render the children
  return children;
}

// Export both components
export { PrivateRoute, PrivateAdminRoute };
