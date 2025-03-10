import React, { useEffect, useState } from "react";
import {
  HeaderWrapper,
  MenuWrapper,
  ProfileDataWrapper,
  UserNameWrapper,
  UserProfileIcon,
} from "./styled-component";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/Button/styled-component";
import {
  clearChat,
  getUserProfileData,
  logOut,
} from "../../services/firebaseFunctions";
import useAuthActions from "../../hooks/useAuthActions";
import toast from "react-hot-toast";
import { CircleUserRound, LogOut, Trash2 } from "lucide-react";
import { ModalSmall } from "../../utils/Modal";
import { getLastLoginTimeFormat } from "../../utils/timeFormat";

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
    }
  };

  const clearUserChat = async () => {
    try {
      await clearChat(user?.id);
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const chatUserId =
        user?.id === "E2TQeZUj6KPn8soR5w8dxU0kIaG2"
          ? "ciYFmIKAXZhlFXvmgxLvbVOtvmv2"
          : "E2TQeZUj6KPn8soR5w8dxU0kIaG2";

      const chatUser = await getUserProfileData(chatUserId);
      setChatUserData(chatUser);
    };
    getUser();
  }, [user?.id]);

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
                <p>{getLastLoginTimeFormat(chatUserData.lastLogin)}</p>
              </ProfileDataWrapper>
            )}
          </>
        )}
      </UserNameWrapper>
      <MenuWrapper>
        <ModalSmall
          trigger={
            <CustomButton type="button">
              <Trash2 size={18} />
            </CustomButton>
          }
          content={{
            title: "Clear chat?",
            buttonText: "Yes",
          }}
          action={clearUserChat}
        />

        <ModalSmall
          trigger={
            <CustomButton type="button">
              <LogOut size={18} />
            </CustomButton>
          }
          content={{
            title: "Logout?",
            buttonText: "Yes",
          }}
          action={logoutUser}
        />
      </MenuWrapper>
    </HeaderWrapper>
  );
}

export default Header;
