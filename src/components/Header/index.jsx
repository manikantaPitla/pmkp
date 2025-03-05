import React from "react";
import { HeaderWrapper } from "./styled-component";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/Button/styled-component";
import { logOut } from "../../services/firebaseFunctions";
import useAuthActions from "../../hooks/useAuthActions";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

function Header({ user }) {
  const navigate = useNavigate();
  const { removeUser } = useAuthActions();
  const logoutUser = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      removeUser();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <HeaderWrapper>
      {user ? (
        <CustomButton type="button" onClick={logoutUser}>
          <LogOut size={18} />
        </CustomButton>
      ) : (
        <Link to="/login">
          <CustomButton type="button">Login</CustomButton>
        </Link>
      )}
    </HeaderWrapper>
  );
}

export default Header;
