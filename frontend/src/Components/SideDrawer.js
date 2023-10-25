import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider.js";
import ProfileModal from "./ProfileModal.js";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading.js";
import UserListItem from "./UserAvatar/UserListItem.js";
import { getSender } from "../config/ChatLogics.js";
import "./styles.css";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isSmallScreen] = useMediaQuery("(max-width: 576px)");
  const [isVerySmallScreen] = useMediaQuery("(max-width: 405px)");

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  // const handleMenuItemClick = (notify) => {
  //   console.log("Clicked on notification:", notify);
  //   setSelectedChat(notify.chat);
  //   setNotification(notification.filter((n) => n !== notify));
  // };
  const handleSearch = async (search) => {
    if (!search) {
      // toast({
      //   title: "Please Enter something in search",
      //   status: "warning",
      //   duration: 2000,
      //   isClosable: true,
      //   position: "top-left",
      // });
      // return;
      if (!search) {
        setSearchResult([]);
        return;
      }
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error in fetching the chat",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  // const fetchSearchResults = async (input) => {
  //   if (!input) {
  //     setSearchResult([]);
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };

  //     const { data } = await axios.get(`/api/user?search=${input}`, config);

  //     setSearchResult(data);
  //     setLoading(false);
  //   } catch (error) {
  //     toast({
  //       title: "Error Occurred!",
  //       description: "Failed to Load the Search Results",
  //       status: "error",
  //       duration: 2000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //   }
  // };

  // Update the search results as you type in the input field
  useEffect(() => {
    handleSearch(search);
  }, [search]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="98.9%"
        ml={"10px"}
        mr={"10px"}
        p="4px 0px 4px 0px"
        borderRadius="lg"
        borderWidth={"2px"}
        mt={2}
        boxShadow=" 0 0 5px #020161f1"
        // borderRadius={"md"}
      >
        <Box display="flex">
          <Tooltip label="Search Users" hasArrow placement="bottom-end">
            <Button
              variant={"ghost"}
              borderRadius={"2xl"}
              width={"100%"}
              display="flex" // Make the button's content flex
              alignItems="center" // Align content vertically in the button
              justifyContent="flex-start" // Align content to the left within the button
              borderLeftRadius={0}
              bg={"#020161f1"}
              // boxShadow="0 0 10px #020161f1"
              onClick={onOpen}
            >
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  color: "white",
                  // padding: "8px",
                  // borderRadius: "50%",
                }}
              />
              <Text
                display={isSmallScreen ? "none" : "flex"}
                px={isSmallScreen ? "5%" : "12%"}
                color={"white"}
              >
                Search User
              </Text>
            </Button>
          </Tooltip>
        </Box>
        <Text
          fontFamily="Libre Baskerville"
          fontSize={
            isSmallScreen ? (isVerySmallScreen ? "10px" : "14px") : "25px"
          }
          fontWeight={"bold"}
          // bg={"blue"}
          // flex="0.6"
        >
          Chat-Stream
        </Text>
        <div>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  p={1}
                  m={1}
                  isActive={isOpen}
                  as={Button}
                  style={{ background: "transparent" }}
                >
                  <div>
                    {notification.length > 0 && (
                      <div className="notification-badge">
                        <span className="badge">{notification.length}</span>
                      </div>
                    )}
                  </div>
                  <BellIcon boxSize={6} color={"blue.700"}></BellIcon>
                </MenuButton>
                <MenuList pl={2}>
                  {!notification.length && "No new message"}
                  {notification.map((notify) => (
                    <MenuItem
                      key={notify._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedChat(notify.chat);
                        console.log("hello");
                        setNotification(
                          notification.filter((n) => n !== notify)
                        );
                      }}
                    >
                      {notify.chat.isGroupChat
                        ? `New message in ${notify.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notify.chat.users
                          )}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              style={{ background: "transparent" }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.photo}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="1px"
            display={"flex"}
            alignItems={"center"}
            justifyContent="flex-start" // Align content to the left within the button
          >
            <IconButton
              icon={<ArrowBackIcon boxSize={6} ml={0} />}
              onClick={onClose}
              bg={"transparent"}
              variant={"ghost"}
              mr={1}
              mt={0}
              color="blue.700"
            />
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box
              display="flex"
              borderRadius={"2xl"}
              borderWidth={2}
              // boxShadow="0 0 10px #020161f1"
              borderColor={"blackAlpha.400"}
              p={0}
              mb={2}
            >
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRightRadius={0}
                borderLeftRadius={"2xl"}
                p={0}
                pl={"5%"}
                _focus={{
                  borderColor: "transparent", // Remove the blue border when typing
                  boxShadow: "0 0 10px #020161f1",
                }}
              />
              <Button
                bg={"#020161f1"}
                onClick={handleSearch}
                borderTopLeftRadius={0} // Remove left top border radius for the button
                borderBottomLeftRadius={0}
                borderRightRadius={"2xl"} // Remove left bottom border radius for the button
                p={0}
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{
                    color: "white",
                  }}
                />
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
