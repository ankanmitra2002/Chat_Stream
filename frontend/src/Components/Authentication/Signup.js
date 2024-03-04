import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  HStack,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const Signup = () => {
  const [isSmallScreen] = useMediaQuery("(max-width: 400px)");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [photo, setPhoto] = useState();
  const [selectedFileName, setSelectedFileName] = useState();
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
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePasswordLength = (password) => {
    const minLength = 8;
    return password.length >= minLength;
  };
  const validatePasswordCharacter = (password) => {
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
    return specialCharacterRegex.test(password);
  };
  const picUpload = (photo) => {
    setLoading(true);
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

    if (!validateEmail(email)) {
      toast({
        title: "Please enter a valid email address",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

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
        title: "Password Should Contain Atleast One Special Character",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Enter All the Required Fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
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
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, photo },
        config
      );
      toast({
        title: "Registration is successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));

      setTimeout(() => {
        setLoading(false);
        setShouldRefresh(true);
        history.push("/chat");
      }, 1000);
    } catch (error) {
      toast({
        title: "Some Error Occurred!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleFileSelect = (event) => {
    const photo = event.target.files[0];
    if (photo) {
      setSelectedFileName(photo.name);
      picUpload(photo);
    } else {
      setSelectedFileName("");
    }
  };
  return (
    <VStack spacing="4px">
      <FormControl id="first-name" isRequired mb="3" borderColor="black">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(event) => setName(event.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired mb="3" borderColor="black">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired mb="3" borderColor="black">
        <FormLabel>Password</FormLabel>
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
      <FormControl id="password" isRequired mb="3" borderColor="black">
        <FormLabel>Password</FormLabel>
        <InputGroup borderColor="black">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(event) => setConfirmpassword(event.target.value)}
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

      <FormLabel alignSelf="start">Upload Your Profile Photo</FormLabel>
      <FormControl
        id="pic"
        mb="3"
        borderColor="black"
        borderWidth="1px"
        borderRadius="md"
        p="3"
      >
        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <HStack spacing="2" alignItems="center">
            <AttachmentIcon />
          </HStack>
        </label>
        {selectedFileName && (
          <Text fontSize="sm" color="black">
            {selectedFileName}
          </Text>
        )}
      </FormControl>

      <Button
        bg="black"
        color="white"
        marginLeft="auto"
        marginRight="auto"
        _hover={{
          boxShadow: "none",
          transition: "none",
        }}
        onClick={submitHandler}
        isLoading={loading}
        fontSize={isSmallScreen ? "15px" : "18px"}
        width={isSmallScreen ? "85%" : "70%"}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
