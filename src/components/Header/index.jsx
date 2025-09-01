import React, { useEffect, useState, useCallback, useRef } from "react";
import { HeaderWrapper, MenuWrapper, MenuDropdown, MenuItem, ProfileDataWrapper, UserNameWrapper } from "./styled-component";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/Button/styled-component";
import { useLoading, useMessage, useAuthActions } from "../../hooks";
import { LogOut, Trash2, Bell, Menu, X } from "lucide-react";
import { clearChat, getUserProfileData, getUserProfileSnapShotData, logOut, sendMail } from "../../services";
import { ProfileSkeleton, ModalSmall, getLastLoginTimeFormat, toast, mId, pId } from "../../utils";
import { useSelector } from "react-redux";

function Header() {
  const currentUser = useSelector(state => state.auth.user);

  const [chatUserData, setChatUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const { loading: mailLoading, startLoading: startMailLoading, stopLoading: stopMailLoading } = useLoading();

  const navigate = useNavigate();
  const { removeUser } = useAuthActions();
  const { clearMessages } = useMessage();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const menuRef = useRef(null);

  const notifyUser = useCallback(async () => {
    try {
      startMailLoading();
      await toast.promise(sendMail(chatUserData.username, chatUserData.email), {
        loading: "Sending mail notification...",
        success: "Mail notification sent successfully",
        error: err => err.message,
      });
      closeMenu();
    } catch (error) {
      toast.error(error.text || "Unable to send mail notification");
    } finally {
      stopMailLoading();
    }
  }, [chatUserData, closeMenu]);

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

      closeMenu();
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  }, [clearMessages, removeUser, navigate, closeMenu]);

  const clearUserChat = useCallback(async () => {
    if (!currentUser) return;

    try {
      await toast.promise(clearChat(currentUser.id), {
        loading: "Deleting messages...",
        success: "Chat deleted successfully",
        error: err => err.message,
      });
      closeMenu();
    } catch (error) {}
  }, [currentUser, closeMenu]);

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

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

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
      <MenuWrapper ref={menuRef}>
        <CustomButton type="button" onClick={toggleMenu} title="Menu" className={isMenuOpen ? "menu-open" : ""}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </CustomButton>

        {isMenuOpen && (
          <MenuDropdown>
            <MenuItem onClick={notifyUser} disabled={mailLoading}>
              <Bell />
              <span>Send Notification</span>
            </MenuItem>

            <MenuItem onClick={clearUserChat}>
              <Trash2 />
              <span>Clear Chat</span>
            </MenuItem>

            <MenuItem onClick={logoutUser}>
              <LogOut />
              <span>Logout</span>
            </MenuItem>
          </MenuDropdown>
        )}
      </MenuWrapper>
    </HeaderWrapper>
  );
}

export default React.memo(Header);
