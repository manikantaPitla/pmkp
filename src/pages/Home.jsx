import { useCallback } from "react";
import useSessionTimeout from "../hooks/useSessionTimeout";
import { useNavigate } from "react-router-dom";
import { logOut } from "../services";

function Home() {
  const navigate = useNavigate();
  const { isExpired } = useSessionTimeout(undefined, { resetOnMount: true });

  const handleConfirmExpire = useCallback(async () => {
    try {
      await logOut();
    } finally {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <CustomMainLayout>
      <Header />
      <ChatBody />
      <ConfirmationModal
        isOpen={isExpired}
        onClose={() => {}}
        onConfirm={handleConfirmExpire}
        title="Session expired"
        message="You were inactive for 15 minutes. You will be redirected to login."
        confirmText="Okay"
        cancelText=""
        closeOnDocumentClick={false}
        closeOnEscape={false}
      />
    </CustomMainLayout>
  );
}

export default Home;
