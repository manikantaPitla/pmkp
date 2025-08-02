import React, { useEffect, useState, useCallback } from "react";
import { HeaderWrapper, MenuWrapper, ProfileDataWrapper, UserNameWrapper } from "./styled-component";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/Button/styled-component";
import { useLoading, useMessage, useAuthActions } from "../../hooks";
import { LogOut, Trash2, Bell } from "lucide-react";
import { clearChat, getUserProfileData, getUserProfileSnapShotData, logOut, sendMail } from "../../services";
import { ProfileSkeleton, ModalSmall, getLastLoginTimeFormat, toast, mId, pId } from "../../utils";
import { useSelector } from "react-redux";

function Header() {
  const currentUser = useSelector(state => state.auth.user);

  const [chatUserData, setChatUserData] = useState(null);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const { loading: mailLoading, startLoading: startMailLoading, stopLoading: stopMailLoading } = useLoading();

  const navigate = useNavigate();
  const { removeUser } = useAuthActions();
  const { clearMessages } = useMessage();

  const notifyUser = useCallback(async () => {
    try {
      startMailLoading();
      await toast.promise(sendMail(chatUserData.username, chatUserData.email), {
        loading: "Sending mail notification...",
        success: "Mail notification sent successfully",
        error: err => err.message,
      });
    } catch (error) {
      toast.error(error.text || "Unable to send mail notification");
      console.log(error.text);
    } finally {
      stopMailLoading();
    }
  }, [chatUserData]);

  const logoutUser = useCallback(async () => {
    try {
      await toast.promise(
        (async () => {
          await logOut();
          clearMessages();
          removeUser();
        })(),
        {
          loading: "Logging out...",
          success: "Logged out successfully",
          error: err => err.message || "Logout failed",
        }
      );

      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  }, [clearMessages, removeUser, navigate]);

  const clearUserChat = useCallback(async () => {
    if (!currentUser) return;

    try {
      await toast.promise(clearChat(currentUser.id), {
        loading: "Deleting messages...",
        success: "Chat deleted successfully",
        error: err => err.message,
      });
    } catch (error) {
      console.log(error.message);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    startLoading();

    const chatUserId = currentUser.id === pId ? mId : pId;

    const unsubscribe = getUserProfileSnapShotData(chatUserId, chatUser => {
      setChatUserData(chatUser);
      stopLoading();
    });

    return () => {
      if (unsubscribe) unsubscribe();
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
                <p>Profile details not available</p>
              )}
            </ProfileDataWrapper>
          </>
        )}
      </UserNameWrapper>
      <MenuWrapper>
        <CustomButton type="button" onClick={notifyUser} disabled={mailLoading} title="Mail notification">
          <Bell size={20} />
        </CustomButton>

        <ModalSmall
          trigger={
            <CustomButton type="button" title="clear chat">
              <Trash2 size={20} />
            </CustomButton>
          }
          content={{
            title: "Delete chat?",
            buttonText: "Delete",
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
