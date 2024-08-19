import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../Components/Authentication/AuthLayout";
import backgroundImage from "../assets/background.jpg";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    setLoading(true);
    if (!email) {
      toast({
        title: "Please enter your email",
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

      await axios.post("/api/user/resetPasswordRequest", { email }, config);
      toast({
        title: "Password reset link has been sent",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: "Some Error Occurred!",
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
          <FormControl id="email" isRequired mb="3" borderColor="black">
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter Your Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
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
            Send Reset Link
          </Button>
        </VStack>
      </AuthLayout>
    </div>
  );
};

export default ForgetPassword;
