import React from "react";
import MainLayout from "../../components/MainLayout";
import Header from "../../components/Header";
import ChatBody from "../../components/ChatBody";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.auth.user);
  return (
    <MainLayout>
      <Header user={user} />
      <ChatBody userId={user.id} />
    </MainLayout>
  );
}

export default Home;
