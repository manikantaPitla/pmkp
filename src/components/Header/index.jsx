import React, { useEffect, useState, useCallback } from "react";
import {
  HeaderWrapper,
  MenuWrapper,
  ProfileDataWrapper,
  UserNameWrapper,
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
import { LogOut, Trash2, Bell } from "lucide-react";
import { ModalSmall } from "../../utils/Modal";
import { getLastLoginTimeFormat } from "../../utils/timeFormat";
import useLoading from "../../hooks/useLoading";
import { mId, pId } from "../../utils/userIdentity";
import { ProfileSkeleton } from "../../utils/Skeleton";
import { sendMail } from "../../services/emailService";
import useMessage from "../../hooks/useMessage";

function Header({ user }) {
  const [chatUserData, setChatUserData] = useState(null);
  const { loading, startLoading, stopLoading } = useLoading(true);

  const navigate = useNavigate();
  const { removeUser } = useAuthActions();
  const { clearMessages } = useMessage();

  const notifyUser = useCallback(async () => {
    try {
      await toast.promise(sendMail(chatUserData?.email), {
        loading: "Sending mail notification...",
        success: "Mail notification sent successfully",
        error: (err) => err.message,
      });
    } catch (error) {
      toast.error(error.text);
      console.log(error);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      removeUser();
      clearMessages();
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  }, [navigate, removeUser]);

  const clearUserChat = useCallback(async () => {
    try {
      await clearChat(user?.id);
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      if (!user?.id) return;
      try {
        startLoading();
        const chatUserId = user?.id === pId ? mId : pId;
        const chatUser = await getUserProfileData(chatUserId);

        if (isMounted) {
          setChatUserData(chatUser);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        stopLoading();
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return (
    <HeaderWrapper>
      <UserNameWrapper>
        {user && (
          <>
            <ProfileDataWrapper>
              {loading ? (
                <ProfileSkeleton />
              ) : chatUserData ? (
                <>
                  <h1>Anonymous</h1>
                  <p>{getLastLoginTimeFormat(chatUserData?.lastLogin)}</p>
                </>
              ) : (
                <p>No user data available</p>
              )}
            </ProfileDataWrapper>
          </>
        )}
      </UserNameWrapper>
      <MenuWrapper>
        <CustomButton type="button" onClick={notifyUser}>
          <Bell size={18} />
        </CustomButton>

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

        <CustomButton type="button" onClick={logoutUser}>
          <LogOut size={18} />
        </CustomButton>
      </MenuWrapper>
    </HeaderWrapper>
  );
}

export default React.memo(Header);
