import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../Components/Authentication/AuthLayout";
import backgroundImage from "../assets/background.jpg";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const location = useLocation();
  const email = location.state?.email;
  const [shouldRefresh, setShouldRefresh] = useState(false);
  useEffect(() => {
    if (shouldRefresh) {
      window.location.reload();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  useEffect(() => {
    const tempuserInfo = localStorage.getItem("tempuserInfo");
    if (!tempuserInfo) {
      history.push("/");
    }
  }, [history]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("tempuserInfo");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      localStorage.removeItem("tempuserInfo");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value) || value === "") {
      if (value.length <= 1) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) {
          document.getElementById(`otp-${index + 1}`).focus();
        }
      }
    }
  };

  const handleOTPSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast({
        title: "Please enter the 4-digit OTP",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/user/verifyOTP", {
        email,
        otp: enteredOtp,
      });
      const tempuserInfo = localStorage.getItem("tempuserInfo");
      localStorage.removeItem("tempuserInfo");
      localStorage.setItem("userInfo", tempuserInfo);
      toast({
        title: "OTP verified successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        setLoading(false);
        setShouldRefresh(true);
        history.push("/chat");
      }, 1000);
    } catch (error) {
      toast({
        title: error.response.data.message || "Invalid OTP",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      await axios.post("/api/user/resendOTP", { email });
      toast({
        title: "OTP has been resent successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.response.data.message || "Failed to resend OTP",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setResending(false);
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
      <AuthLayout showTabs={false}>
        <VStack spacing="4">
          <Text fontSize="2xl" fontFamily="Libre Baskerville">
            Verify Your Email
          </Text>
          <Text fontSize="md">
            Enter the 4-digit OTP sent to your email: {email}
          </Text>
          <FormControl id="otp" isRequired>
            <FormLabel>OTP</FormLabel>
            <Flex width="100%" justifyContent="center">
              <HStack>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="password"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    maxLength={1}
                    textAlign="center"
                    width="50px"
                    border="2px"
                    borderColor="gray.400"
                    _focus={{ borderColor: "blue.500" }}
                  />
                ))}
              </HStack>
            </Flex>
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={handleOTPSubmit}
            isLoading={loading}
            width="full"
          >
            Verify OTP
          </Button>
          <HStack>
            <Text>Didn't receive the OTP?</Text>
            <Button
              variant="link"
              colorScheme="blue"
              onClick={handleResendOTP}
              isLoading={resending}
            >
              Resend OTP
            </Button>
          </HStack>
        </VStack>
      </AuthLayout>
    </div>
  );
};

export default OTPVerification;
