import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider.js";
import { Box, Text, Spinner } from "@chakra-ui/react";
import SideDrawer from "../Components/SideDrawer.js";
import ChatBox from "../Components/ChatBox.js";
import MyChats from "../Components/MyChats.js";
const ChatPage = () => {
  const { user } = ChatState();
  console.log(user);
  // const [loading, setLoading] = useState(true);
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    // Check if user data is available
    // if (user) {
    //   setLoading(false);
    //   console.log("1"); // Data is available, set loading to false
    // }
    //  else {
    //   window.location.reload();
    // }
  }, [user]);

  return (
    <div style={{ width: "100%", overflowY: "hidden", height: "100vh" }}>
      {user && <SideDrawer></SideDrawer>}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"92%"}
        // bg={"black"}
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
