import React, { useEffect, useState } from "react";
import {
  HeaderWrapper,
  MenuWrapper,
  ProfileDataWrapper,
  UserNameWrapper,
  UserProfileIcon,
} from "./styled-component";
import { useNavigate } from "react-router-dom";
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
import useLoading from "../../hooks/useLoading";
import { mId, pId } from "../../utils/userIdentity";
import { ProfileSkeleton } from "../../utils/Skeleton";

function Header({ user }) {
  const [chatUserData, setChatUserData] = useState("");

  const { loading, startLoading, stopLoading } = useLoading(true);

  const navigate = useNavigate();
  const { removeUser } = useAuthActions();
  const logoutUser = async () => {
    try {
      await logOut();
      removeUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
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
      try {
        startLoading();
        const chatUserId = user?.id === pId ? mId : pId;

        const chatUser = await getUserProfileData(chatUserId);
        setChatUserData(chatUser);
      } catch (error) {
      } finally {
        stopLoading();
      }
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
            <ProfileDataWrapper>
              {loading ? (
                <ProfileSkeleton />
              ) : (
                chatUserData && (
                  <>
                    <h1>{chatUserData.name}</h1>
                    <p>{getLastLoginTimeFormat(chatUserData.lastLogin)}</p>
                  </>
                )
              )}
            </ProfileDataWrapper>
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
