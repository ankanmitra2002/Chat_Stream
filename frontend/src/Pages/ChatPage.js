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
    <div style={{ width: "100%" }}>
      {user && <SideDrawer></SideDrawer>}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"100%"}
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
      {/* {loading ? (
        <Spinner size="xl" color="blue.500" thickness="4px" />
      ) : user ? (
        <>
          <SideDrawer />
          <Box
            d="flex"
            justifyContent="space-between"
            w="100%"
            h="90vh"
            p="10px"
          >
            <MyChats />
            <ChatBox />
          </Box>
        </>
      ) : (
        <Text color="red">User data not available</Text>
      )} */}
    </div>
  );
};

export default ChatPage;
