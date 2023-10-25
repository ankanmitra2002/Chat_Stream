import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
  useMediaQuery,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider.js";
import UserBadgeItem from "./UserAvatar/UserBadgeItem.js";
import UserListItem from "./UserAvatar/UserListItem.js";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();
  const [isSmallScreen] = useMediaQuery("(max-width: 600px)");
  const [isVerySmallScreen] = useMediaQuery("(max-width: 370px)");

  const isAdmin = selectedChat.groupAdmin?._id === user._id;

  const handleSearch = async (search) => {
    setSearch(search);
    if (!search) {
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (!isAdmin && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };
  useEffect(() => {
    handleSearch(search);
  }, [search]);

  const handleDeleteGroup = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.delete(
        `/api/chat/groupdelete/${selectedChat._id}`,
        config
      );

      if (response.status === 200) {
        // The chat has been deleted successfully
        // You can handle any necessary actions here, such as updating the UI.
        toast({
          title: "Group deleted successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
        onClose();
        setSelectedChat("");
        setFetchAgain(!fetchAgain);
        setLoading(false);
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      toast({
        title: "Failed to delete group",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        bg={"transparent"}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          w={isSmallScreen ? (isVerySmallScreen ? "90%" : "70%") : "50%"}
        >
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize={isSmallScreen ? "15px" : "30px"}
            fontWeight="bold"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Give new name"
                mb={2}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                borderColor={"black"}
              />
              <Button
                variant="solid"
                bg={"#b601b37d"}
                color={"white"}
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
                borderColor="black"
                // fontSize={isSmallScreen ? "10px" : "15px"}
                // width={isSmallScreen ? "10%" : "20%"}
              >
                Rename
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                // mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                borderColor="black"
              />
            </FormControl>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <Box
                w="100%"
                maxHeight="150px" // Set a maximum height for the container
                overflowY="auto" // Add a scrollbar when content exceeds the maximum height
              >
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter display={"flex"} justifyContent={"space-between"}>
            {isAdmin && (
              <Text fontSize="20px" color="#38B2AC" mr={1}>
                Admin
              </Text>
            )}
            <Button
              onClick={() => handleRemove(user)}
              colorScheme="red"
              mr={1}
              fontSize={isSmallScreen ? "12px" : "17px"}
              // fontSize={"auto"}
              // width={isSmallScreen ? "10%" : "20%"}
            >
              Leave Group
            </Button>
            {isAdmin && (
              <>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteGroup}
                  fontSize={isSmallScreen ? "12px" : "17px"}
                >
                  Delete Group
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
