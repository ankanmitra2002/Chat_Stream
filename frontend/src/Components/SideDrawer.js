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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider.js";
import ProfileModal from "./ProfileModal.js";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading.js";
import UserListItem from "./UserAvatar/UserListItem.js";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isSmallScreen] = useMediaQuery("(max-width: 576px)");
  const [isVerySmallScreen] = useMediaQuery("(max-width: 405px)");

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return;
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
  const fetchSearchResults = async (input) => {
    if (!input) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${input}`, config);

      setSearchResult(data);
      setLoading(false);
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

  // Update the search results as you type in the input field
  useEffect(() => {
    fetchSearchResults(search);
  }, [search]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
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
            <MenuButton p={1} m={1}>
              <BellIcon boxSize={6} color="blue.700"></BellIcon>
              {/* <MenuList></MenuList> */}
            </MenuButton>
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
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
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
