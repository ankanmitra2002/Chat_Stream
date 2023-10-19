import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import {
  Box,
  Button,
  Stack,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading.js";
import { getSender } from "../config/ChatLogics.js";
import GroupChatModal from "./GroupChatModal.js";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [isVerySmallScreen] = useMediaQuery("(max-width: 300px)");
  const [isSmallScreen] = useMediaQuery("(max-width: 405px)");
  const [isMediumScreen] = useMediaQuery(
    "(min-width: 700px) and (max-width:900px)"
  );

  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to Load the chats",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: isMediumScreen ? "40%" : "30%" }}
      // w={isSmallScreen ? "100%" : "50%"}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={2}
        fontSize={
          isSmallScreen ? (isVerySmallScreen ? "15px" : "20px") : "30px"
        }
        display={"flex"}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={isVerySmallScreen ? "12px" : "15px"}
            rightIcon={<AddIcon />}
            bg={"green.600"}
            color={"white"}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
