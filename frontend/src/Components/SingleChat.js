import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Button,
  IconButton,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal.js";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import io from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChatModal.js";
import { ChatState } from "../context/chatProvider.js";
import ScrollableChat from "./ScrollableChat";
import SpeechToText from "./SpeectToText";
const ENDPOINT = "https://chat-stream-6uay.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const toast = useToast();

  function countNewlines(text) {
    const newlineRegex = /\n/g;
    const matches = text.match(newlineRegex);
    return matches ? matches.length : 0;
  }
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const handleSpeechResult = (result) => {
    setNewMessage(result);
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageContentWithNewlines = newMessage.replace(/\n/g, "<br>");

        const { data } = await axios.post(
          "/api/message",
          {
            // content: newMessage,
            content: messageContentWithNewlines,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setNewMessage("");
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the Message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [selectedChat, socketConnected]);

  useEffect(() => {
    if (!selectedChat) return;
    setNewMessage("");
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, user]);
  console.log(notification, "--------------");
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        setFetchAgain(!fetchAgain);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    const roomId = selectedChat?._id;
    if (!typing && roomId) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 1000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon boxSize={6} />}
              bg={"transparent"}
              color="blue.700"
              onClick={() => setSelectedChat("")}
            />
            {messages && !selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#ece5dd"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "hidden",
                }}
                className="chat-container"
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            {istyping ? <div>typing..</div> : <></>}
            <FormControl
              // onKeyDown={sendMessage}
              id="first-name"
              isRequired
              display={"flex"}
              mt={3}
            >
              <Textarea
                bg="white"
                placeholder="Message.."
                value={newMessage}
                onChange={typingHandler}
                borderRadius={"20px"}
                minHeight="48px" // Adjust the minimum height as needed
                alignItems={"center"}
                overflowY={"hidden"}
                rows={
                  countNewlines(newMessage) === 0
                    ? 1
                    : countNewlines(newMessage) <= 3
                    ? countNewlines(newMessage)
                    : 3
                }
                resize="none"
              />
              <SpeechToText onSpeechResult={handleSpeechResult} />

              <Button
                bg={"#075e54"}
                onClick={sendMessage}
                borderRadius={"50%"}
                p={0}
                ml={1}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{
                    color: "white",
                  }}
                />
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
