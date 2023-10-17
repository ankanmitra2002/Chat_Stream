import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useHistory } from "react-router-dom";
import WAVES from "vanta/dist/vanta.waves.min.js";
import * as THREE from "three";
const HomePage = () => {
  const [vantaEffect, setVantaEffect] = useState(0);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 600.0,
          minWidth: 600.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x11a,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chat");
  }, [history]);

  return (
    <div style={{ width: "100%", height: "900px", margin: 0 }} ref={myRef}>
      <Container
        maxW="2xl"
        centerContent
        style={{ width: "100%", height: "100%" }}
      >
        <Box
          d="flex"
          justifyContent="center"
          p="4"
          bg="white"
          w="100%"
          m="10px 0 10px 0"
          borderRadius="10px"
          borderWidth="1px"
          boxShadow="outline"
        >
          <Text
            fontFamily="Libre Baskerville"
            fontSize="2xl"
            textAlign="center"
          >
            Chat-Stream
          </Text>
        </Box>
        <Box
          width="100%"
          bg="white"
          p="4"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="black"
          boxShadow="outline"
        >
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb="10px">
              <Tab width="50%" fontFamily="Libre Baskerville">
                Login
              </Tab>
              <Tab width="50%" fontFamily="Libre Baskerville">
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};
export default HomePage;
