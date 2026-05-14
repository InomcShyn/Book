import { useDispatch, useSelector } from "react-redux";
import { logoutAction, selectAuth } from "./auth.slice";
import { loginUserAction } from "./auth.action";
import { useNavigate } from "react-router-dom";
import PATH from "@/configs/paths/PATH";

export default function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);

  const logInUser = (payload) => dispatch(loginUserAction(payload));

  const logOutUser = () => {
    dispatch(logoutAction());
    navigate(PATH.LOGIN);
  };

  return {
    user,
    isAuthenticated,
    logOutUser,
    logInUser,
  };
}
