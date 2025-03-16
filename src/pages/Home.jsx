import React from "react";
import { Header, ChatBody } from "../components";
import { CustomMainLayout } from "../utils";

function Home() {
  return (
    <CustomMainLayout>
      <Header />
      <ChatBody />
    </CustomMainLayout>
  );
}

export default Home;
