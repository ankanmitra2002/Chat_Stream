import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider.js";
import { Box, Text, Spinner } from "@chakra-ui/react";
import SideDrawer from "../Components/SideDrawer.js";
import ChatBox from "../Components/ChatBox.js";
import MyChats from "../Components/MyChats.js";
const ChatPage = () => {
  const { user } = ChatState();
  console.log(user);
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {}, [user]);

  return (
    <div style={{ width: "100%", overflowY: "hidden", height: "100vh" }}>
      {user && <SideDrawer></SideDrawer>}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"92%"}
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain}></MyChats>}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          ></ChatBox>
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
