import React, { useEffect, useState, useRef } from "react";
import { TabList, TabPanels, Tab, TabPanel, Link, Box } from "@chakra-ui/react";
import AuthLayout from "../Components/Authentication/AuthLayout";
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
          minHeight: 300.0,
          minWidth: 300.0,
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
    <div style={{ width: "100%", height: "100vh", margin: 0 }} ref={myRef}>
      <AuthLayout>
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
            <Box width="100%" textAlign="center" mt="4">
              <Link
                href="/forgot-password"
                color="blue.800"
                fontSize={19}
                _hover={{ textDecoration: "underline" }}
              >
                Forgot Password?
              </Link>
            </Box>
          </TabPanel>
          <TabPanel>
            <Signup />
          </TabPanel>
        </TabPanels>
      </AuthLayout>
    </div>
  );
};
export default HomePage;
