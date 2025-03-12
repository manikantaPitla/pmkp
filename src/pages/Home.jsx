import React, { useMemo } from "react";
import { CustomMainLayout } from "../components/MainLayout";
import Header from "../components/Header";
import ChatBody from "../components/ChatBody";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.auth.user);

  const memoizedUser = useMemo(() => user, [user]);

  return (
    <CustomMainLayout>
      <Header user={memoizedUser} />
      <ChatBody userId={memoizedUser?.id} />
    </CustomMainLayout>
  );
}

export default React.memo(Home);
