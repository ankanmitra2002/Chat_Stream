import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider.js";
import ProfileModal from "./ProfileModal.js";
import { useHistory } from "react-router-dom";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [isSmallScreen] = useMediaQuery("(max-width: 576px)");
  const [isVerySmallScreen] = useMediaQuery("(max-width: 405px)");
  const { user } = ChatState();
  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="4px 0px 4px 0px"
        borderWidth="2px"
        borderColor={"#020161f1"}
        borderRadius={"md"}
      >
        <Box display="flex" width={"30%"}>
          <Tooltip label="Search Users" hasArrow placement="bottom-end">
            <Button
              variant={"ghost"}
              borderRadius={"3xl"}
              width={"100%"}
              display="flex" // Make the button's content flex
              alignItems="center" // Align content vertically in the button
              justifyContent="flex-start" // Align content to the left within the button
              // borderWidth={1}
              // borderColor={"blue"}
              boxShadow="0 0 10px #020161f1"
            >
              <FontAwesomeIcon
                icon={faSearch}
                // style={{
                //   background: "violet",
                //   padding: "8px",
                //   borderRadius: "50%",
                // }}
              />
              <Text
                display={isSmallScreen ? "none" : "flex"}
                px={isSmallScreen ? "5%" : "12%"}
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
          flex="0.6"
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
    </>
  );
};

export default SideDrawer;
