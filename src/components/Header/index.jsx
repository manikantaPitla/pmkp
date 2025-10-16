import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, useMessage, useAuthActions } from "../../hooks";
import { clearChat, getUserProfileSnapShotData, logOut, sendMail } from "../../services";
import { getLastLoginTimeFormat, toast, mId, pId, PRESENCE } from "../../utils";
import { useSelector } from "react-redux";

function Header() {
  const currentUser = useSelector(state => state.auth.user);

  const [chatUserData, setChatUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotificationConfirm, setShowNotificationConfirm] = useState(false);
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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

  const handleNotificationClick = useCallback(() => {
    setShowNotificationConfirm(true);
    closeMenu();
  }, [closeMenu]);

  const confirmNotification = useCallback(async () => {
    try {
      startMailLoading();
      await toast.promise(sendMail(chatUserData.username, chatUserData.email), {
        loading: "Sending mail notification...",
        success: "Mail notification sent successfully",
        error: err => err.message,
      });
    } catch (error) {
      toast.error(error.text || "Unable to send mail notification");
    } finally {
      stopMailLoading();
    }
  }, [chatUserData, startMailLoading, stopMailLoading]);

  const handleLogoutClick = useCallback(() => {
    setShowLogoutConfirm(true);
    closeMenu();
  }, [closeMenu]);

  const confirmLogout = useCallback(async () => {
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

  const handleClearChatClick = useCallback(() => {
    setShowClearChatConfirm(true);
    closeMenu();
  }, [closeMenu]);

  const confirmClearChat = useCallback(async () => {
    if (!currentUser) return;

    try {
      await toast.promise(clearChat(currentUser.id), {
        loading: "Deleting messages...",
        success: "Chat deleted successfully",
        error: err => err.message,
      });
    } catch {}
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
                  {(() => {
                    const online = chatUserData?.online;
                    const hb = chatUserData?.heartbeatAt?.toMillis ? chatUserData.heartbeatAt.toMillis() : chatUserData?.heartbeatAt;
                    const stale = hb ? Date.now() - hb > PRESENCE.STALE_MS : true;
                    const isOnlineActive = online && !stale;
                    return (
                      <p style={{ color: isOnlineActive ? "var(--status-online)" : undefined }}>
                        {isOnlineActive ? "Online" : getLastLoginTimeFormat(chatUserData?.lastSeen || chatUserData?.lastLogin)}
                      </p>
                    );
                  })()}
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
            <MenuItem onClick={handleNotificationClick} disabled={mailLoading}>
              <Bell />
              <span>Send Notification</span>
            </MenuItem>

            <MenuItem onClick={handleClearChatClick}>
              <Trash2 />
              <span>Clear Chat</span>
            </MenuItem>

            <MenuItem onClick={handleLogoutClick}>
              <LogOut />
              <span>Logout</span>
            </MenuItem>
          </MenuDropdown>
        )}
      </MenuWrapper>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showNotificationConfirm}
        onClose={() => setShowNotificationConfirm(false)}
        onConfirm={confirmNotification}
        title="Send Notification"
        message="Are you sure you want to send a notification email to the user? This will notify them about new messages."
        confirmText="Send"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showClearChatConfirm}
        onClose={() => setShowClearChatConfirm(false)}
        onConfirm={confirmClearChat}
        title="Clear Chat"
        message="Are you sure you want to clear all chat messages? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to login again to access the chat."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </HeaderWrapper>
  );
}

export default React.memo(Header);
