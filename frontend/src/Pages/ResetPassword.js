import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import AuthLayout from "../Components/Authentication/AuthLayout";
import backgroundImage from "../assets/background.jpg";
const ResetPassword = () => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleClick = () => setShow(!show);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      history.push("/");
    }
  }, [location.search, history]);

  const submitHandler = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!password || !confirmPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
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

      await axios.post(
        "/api/user/resetPassword",
        { email, password, token },
        config
      );
      toast({
        title: "Password reset successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

      setTimeout(() => {
        setLoading(false);
        localStorage.removeItem("userInfo");
        history.push("/");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error Occurred!",
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
    <div
      style={{
        width: "100%",
        height: "100vh",
        margin: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AuthLayout>
        <VStack spacing="4px">
          <FormControl id="password" isRequired mb="3" borderColor="black">
            <FormLabel>New Password</FormLabel>
            <InputGroup borderColor="black">
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter New Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label={show ? "Hide Password" : "Show Password"}
                  icon={show ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={handleClick}
                  bg="transparent"
                  _hover={{
                    boxShadow: "none",
                    transition: "none",
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl
            id="confirmPassword"
            isRequired
            mb="3"
            borderColor="black"
          >
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup borderColor="black">
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label={show ? "Hide Password" : "Show Password"}
                  icon={show ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={handleClick}
                  bg="transparent"
                  _hover={{
                    boxShadow: "none",
                    transition: "none",
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            mb="2"
            bg="#45458e"
            color="white"
            _hover={{
              boxShadow: "none",
              transition: "none",
            }}
            onClick={submitHandler}
            isLoading={loading}
            width="70%"
          >
            Reset Password
          </Button>
        </VStack>
      </AuthLayout>
    </div>
  );
};

export default ResetPassword;
