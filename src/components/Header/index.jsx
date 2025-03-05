import React, { useEffect, useState } from "react";
import {
  HeaderWrapper,
  ProfileDataWrapper,
  UserNameWrapper,
  UserProfileIcon,
} from "./styled-component";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/Button/styled-component";
import { getUserProfileData, logOut } from "../../services/firebaseFunctions";
import useAuthActions from "../../hooks/useAuthActions";
import toast from "react-hot-toast";
import { CircleUserRound, LogOut } from "lucide-react";

function Header({ user }) {
  const [chatUserData, setChatUserData] = useState("");

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

  useEffect(() => {
    const getUser = async () => {
      const chatUserId =
        user.id === "E2TQeZUj6KPn8soR5w8dxU0kIaG2"
          ? "ciYFmIKAXZhlFXvmgxLvbVOtvmv2"
          : "E2TQeZUj6KPn8soR5w8dxU0kIaG2";

      const chatUser = await getUserProfileData(chatUserId);
      setChatUserData(chatUser);
      console.log(chatUser);
    };
    getUser();
  }, [user.id]);

  function convertTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds

    // Formatting options
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    // Format date in "Mar 05 2025 2:34 PM" style
    const formattedDate = date
      .toLocaleString("en-US", options)
      .replace(",", "");

    return `Last login on ${formattedDate}`;
  }

  return (
    <HeaderWrapper>
      <UserNameWrapper>
        {user && (
          <>
            <UserProfileIcon>
              <CircleUserRound size={34} strokeWidth={1} />
            </UserProfileIcon>
            {chatUserData && (
              <ProfileDataWrapper>
                <h1>{chatUserData.name}</h1>
                <p>{convertTimestamp(chatUserData.lastLogin)}</p>
              </ProfileDataWrapper>
            )}
          </>
        )}
      </UserNameWrapper>
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
