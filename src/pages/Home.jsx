import React from "react";
import { CustomMainLayout } from "../components/MainLayout";
import Header from "../components/Header";
import ChatBody from "../components/ChatBody";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.auth.user);
  return (
    <CustomMainLayout>
      <Header user={user} />
      <ChatBody userId={user?.id} />
    </CustomMainLayout>
  );
}

export default Home;
