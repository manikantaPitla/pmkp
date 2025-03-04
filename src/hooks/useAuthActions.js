import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../app/features/authReducer";

function useAuthActions() {
  const dispatch = useDispatch();

  const setUser = (user) => dispatch(addUser(user));
  const removeUser = (user) => dispatch(clearUser(user));

  return { setUser, removeUser };
}

export default useAuthActions;
