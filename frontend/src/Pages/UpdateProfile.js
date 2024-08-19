import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaCamera } from "react-icons/fa";
import AuthLayout from "../Components/Authentication/AuthLayout";
import backgroundImage from "../assets/background.jpg";
import { useHistory } from "react-router-dom";

const UpdateProfile = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [name, setName] = useState(user.name);
  const [photo, setPhoto] = useState(user.photo);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const toast = useToast();
  const [isSmallScreen] = useMediaQuery("(max-width: 400px)");
  const history = useHistory();

  const handleClick = () => setShow(!show);
  const validatePasswordLength = (password) => {
    const minLength = 8;
    return password.length >= minLength;
  };
  const validatePasswordCharacter = (password) => {
    const specialCharacterRegex =
      /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?!.*\s)/;

    return specialCharacterRegex.test(password);
  };
  const handleClickPasswordChange = () => {
    setShowPasswordFields(!showPasswordFields);
  };
  const handleReset = () => {
    setName(user.name);
    setPhoto(user.photo);
    setPassword("");
    setConfirmPassword("");
    setShowPasswordFields(false);
  };
  const picUpload = (photo) => {
    // setLoading(true);
    if (photo === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      photo.type === "image/jpeg" ||
      photo.type === "image/png" ||
      photo.type === "image.jpg"
    ) {
      const data = new FormData();
      data.append("file", photo);
      data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
      fetch(process.env.REACT_APP_IMAGE_API, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPhoto(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const handleFileSelect = (event) => {
    const photo = event.target.files[0];
    const previewUrl = URL.createObjectURL(photo);
    setPhoto(previewUrl);
    picUpload(photo);
  };
  const submitHandler = async () => {
    setLoading(true);
    if (name.trim() === "") {
      toast({
        title: "Please enter a valid name",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      if (
        (password !== "" && confirmPassword === "") ||
        (password === "" && confirmPassword !== "")
      ) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      if (password && confirmPassword) {
        if (!validatePasswordLength(password)) {
          toast({
            title: "Password Should Be Atleast 8 Characters Long",
            status: "warning",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
        if (!validatePasswordCharacter(password)) {
          toast({
            title:
              "Password Should Contain Atleast One Special Character and No Whitespace Character",
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
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const userId = user._id;
      const { data } = await axios.put(
        `/api/user/update/${userId}`,
        {
          name,
          password,
          photo,
        },
        config
      );
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setShowPasswordFields(false);
      toast({
        title: "Update is successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.message || "Some Error Occurred!",

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
      <AuthLayout showTabs={false}>
        <VStack spacing="4">
          <Flex position="relative" alignItems="center" justifyContent="center">
            <Image
              borderRadius="full"
              boxSize="150px"
              src={photo}
              alt={user.name}
              border="1px solid black"
            />
            <IconButton
              icon={<FaCamera />}
              position="absolute"
              bottom={0}
              right={0}
              color="green"
              onClick={() => document.getElementById("file-upload").click()}
              bg="transparent"
              size="lg"
              _hover={{
                cursor: "pointer",
                boxShadow: "none",
                transition: "none",
              }}
            />
          </Flex>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <FormControl id="first-name" mb="3" borderColor="black">
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </FormControl>

          {showPasswordFields ? (
            <>
              <FormControl id="password" mb="3" borderColor="black">
                <FormLabel>Enter New Password</FormLabel>
                <InputGroup borderColor="black">
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter Your Password"
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
              <FormControl id="password" mb="3" borderColor="black">
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup borderColor="black">
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Confirm Your Password"
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
            </>
          ) : (
            <Button
              mb="1"
              bg="violet"
              _hover={{
                boxShadow: "none",
                transition: "none",
              }}
              fontSize={isSmallScreen ? "10px" : "18px"}
              width={isSmallScreen ? "60%" : "70%"}
              onClick={handleClickPasswordChange}
            >
              Change Password
            </Button>
          )}
          <Flex width="100%" justifyContent="space-around">
            <HStack>
              <Button
                mb="1"
                bg="#1eff00a3"
                _hover={{
                  boxShadow: "none",
                  transition: "none",
                }}
                fontSize={isSmallScreen ? "16px" : "18px"}
                onClick={submitHandler}
                isLoading={loading}
              >
                Update
              </Button>
              <Button
                mb="1"
                bg="#ff0000"
                _hover={{
                  boxShadow: "none",
                  transition: "none",
                }}
                fontSize={isSmallScreen ? "16px" : "18px"}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                mb="1"
                bg="blue.300"
                _hover={{
                  boxShadow: "none",
                  transition: "none",
                }}
                fontSize={isSmallScreen ? "16px" : "18px"}
                onClick={() => history.goBack()}
              >
                Go Back
              </Button>
            </HStack>
          </Flex>
        </VStack>
      </AuthLayout>
    </div>
  );
};

export default UpdateProfile;
