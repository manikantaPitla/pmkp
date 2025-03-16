import React, { useEffect, useState, useCallback } from "react";
import {
  HeaderWrapper,
  MenuWrapper,
  ProfileDataWrapper,
  UserNameWrapper,
} from "./styled-component";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/Button/styled-component";
import { useLoading, useMessage, useAuthActions } from "../../hooks";
import { LogOut, Trash2, Bell } from "lucide-react";
import {
  clearChat,
  getUserProfileData,
  logOut,
  sendMail,
} from "../../services";
import {
  ProfileSkeleton,
  ModalSmall,
  getLastLoginTimeFormat,
  toast,
  mId,
  pId,
} from "../../utils";
import { useSelector } from "react-redux";

function Header() {
  const currentUser = useSelector((state) => state.auth.user);

  const [chatUserData, setChatUserData] = useState(null);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const {
    loading: mailLoading,
    startLoading: startMailLoading,
    stopLoading: stopMailLoading,
  } = useLoading();

  const navigate = useNavigate();
  const { removeUser } = useAuthActions();
  const { clearMessages } = useMessage();

  const notifyUser = useCallback(async () => {
    try {
      startMailLoading();
      await toast.promise(sendMail(chatUserData?.email), {
        loading: "Sending mail notification...",
        success: "Mail notification sent successfully",
        error: (err) => err.message,
      });
    } catch (error) {
      toast.error(error.text || "Unable to send mail notification");
      console.log(error.text);
    } finally {
      stopMailLoading();
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logOut();
      clearMessages();
      removeUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  }, [clearMessages, removeUser, navigate]);

  const clearUserChat = useCallback(async () => {
    if (!currentUser) return;
    try {
      await clearChat(currentUser.id);
      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      if (!currentUser) return;

      try {
        startLoading();
        const chatUserId = currentUser.id === pId ? mId : pId;
        const chatUser = await getUserProfileData(chatUserId);

        if (isMounted) {
          setChatUserData(chatUser);
        }
      } catch (error) {
        console.error("Error getting user profile", error);
      } finally {
        stopLoading();
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <HeaderWrapper>
      <UserNameWrapper>
        {currentUser && (
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
                <p>No user data</p>
              )}
            </ProfileDataWrapper>
          </>
        )}
      </UserNameWrapper>
      <MenuWrapper>
        <CustomButton
          type="button"
          onClick={notifyUser}
          disabled={mailLoading}
          title="Mail notification"
        >
          <Bell size={20} />
        </CustomButton>

        <ModalSmall
          trigger={
            <CustomButton type="button" title="clear chat">
              <Trash2 size={20} />
            </CustomButton>
          }
          content={{
            title: "Clear chat?",
            buttonText: "Yes",
          }}
          action={clearUserChat}
        />

        <CustomButton type="button" onClick={logoutUser} title="Logout">
          <LogOut size={20} />
        </CustomButton>
      </MenuWrapper>
    </HeaderWrapper>
  );
}

export default React.memo(Header);
