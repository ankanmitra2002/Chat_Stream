import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const [shouldRefresh, setShouldRefresh] = useState(false);
  useEffect(() => {
    if (shouldRefresh) {
      // Refresh the page
      window.location.reload();
      // Set the state to prevent further refreshes
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);
  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Login is Successful",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });

      // // setLoading(false);
      // // history.push("/chat");
      // setTimeout(() => {
      //   setLoading(false);
      //   history.push("/chat");
      // }, 1000); // 1000ms delay (1 second) as an example
      setTimeout(() => {
        setLoading(false);
        // Refresh the page

        // Redirect to the chat page
        setShouldRefresh(true);
        history.push("/chat");
      }, 1000); // 1000ms delay (1 second) as an example
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const [isSmallScreen] = useMediaQuery("(max-width: 400px)");
  return (
    <VStack spacing="4px">
      <FormControl id="email" isRequired mb="3" borderColor="black">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired mb="3" borderColor="black">
        <FormLabel>Password</FormLabel>
        <InputGroup borderColor="black">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label={show ? "Hide Password" : "Show Password"}
              icon={show ? <ViewOffIcon /> : <ViewIcon />} // Use eye icons
              // size="sm"
              onClick={handleClick}
              bg="transparent"
              _hover={{
                boxShadow: "none", // Remove boxShadow on hover
                transition: "none", // Remove transition on hover
              }}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        mb="2"
        bg="#45458e"
        color="white"
        // marginLeft="auto" // Add marginLeft to center the button
        // marginRight="auto" // Add marginRight to center the button
        _hover={{
          boxShadow: "none", // Remove boxShadow on hover
          transition: "none", // Remove transition on hover
        }}
        onClick={submitHandler}
        isLoading={loading}
        fontSize={isSmallScreen ? "16px" : "18px"}
        width={isSmallScreen ? "85%" : "70%"}
      >
        Login
      </Button>
      <Button
        bg="#6a1740"
        color="white"
        // marginLeft={isSmallScreen ? "0" : "auto"} // Add marginLeft to center the button
        // marginRight={isSmallScreen ? "0" : "auto"} // Add marginRight to center the button
        _hover={{
          boxShadow: "none", // Remove boxShadow on hover
          transition: "none", // Remove transition on hover
        }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("password");
        }}
        fontSize={isSmallScreen ? "15px" : "18px"}
        width={isSmallScreen ? "85%" : "70%"}
      >
        Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
