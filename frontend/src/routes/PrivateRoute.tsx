import { Navigate } from "react-router-dom";
import { setAccesToken } from "../apis/axiosConfig";
import { RootState } from "../stores/store";
import { useAppSelector } from "../stores/storeHooks";

const userRole = (state: RootState) => state.user.userInfos;

function PrivateRoute({ children }: any) {

  const lsUser = useAppSelector(userRole);
  if (lsUser) { setAccesToken(lsUser.token) }
  if (!lsUser) return <Navigate to={"/login"} />;
  return children;
}

export default PrivateRoute;
